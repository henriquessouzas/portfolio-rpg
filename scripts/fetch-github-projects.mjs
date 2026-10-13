#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputFile = path.join(rootDir, 'src', 'data', 'github-projects.json');
const portfolioFile = path.join(rootDir, 'src', 'lib', 'portfolio-data.ts');

function resolveGithubUser() {
  const envUser = process.env.GITHUB_USER?.trim();
  if (envUser) return envUser;

  try {
    const text = readFileSync(portfolioFile, 'utf8');
    const match = text.match(/github:\s*['"]([^'"]+)['"]/);
    if (match?.[1]) return match[1].trim();
  } catch {
    // fallback below
  }

  return '';
}

function buildHeaders() {
  const headers = {
    Accept: 'application/vnd.github+json',
  };

  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function readCurrentSnapshot() {
  try {
    const raw = await readFile(outputFile, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function sortRepos(repos) {
  return [...repos].sort((left, right) => {
    const leftTime = new Date(left.pushed_at ?? 0).getTime();
    const rightTime = new Date(right.pushed_at ?? 0).getTime();

    if (rightTime !== leftTime) {
      return rightTime - leftTime;
    }

    return String(left.name ?? '').localeCompare(String(right.name ?? ''));
  });
}

async function main() {
  const user = resolveGithubUser();

  if (!user) {
    console.warn('Warning: GITHUB_USER is not set and no GitHub username was found in src/lib/portfolio-data.ts. Skipping snapshot refresh.');
    process.exit(0);
  }

  const snapshot = await readCurrentSnapshot();

  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=pushed&type=owner`,
      {
        headers: buildHeaders(),
      },
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`GitHub API request failed (${response.status}): ${body}`);
    }

    const payload = await response.json();
    const repos = Array.isArray(payload) ? payload : [];

    const normalized = sortRepos(repos).map((repo) => ({
      name: repo.name,
      description: repo.description ?? null,
      language: repo.language ?? null,
      topics: Array.isArray(repo.topics) ? repo.topics : [],
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count ?? 0,
      pushed_at: repo.pushed_at ?? null,
      fork: Boolean(repo.fork),
      archived: Boolean(repo.archived),
    }));

    await writeFile(outputFile, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
    console.log(`Saved ${normalized.length} GitHub repositories for ${user} to ${outputFile}`);
  } catch (error) {
    const previous = JSON.stringify(snapshot, null, 2);
    if (previous !== '[]') {
      await writeFile(outputFile, `${previous}\n`, 'utf8');
    }

    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Warning: failed to refresh GitHub snapshot. Keeping the current file. ${message}`);
    process.exit(0);
  }
}

main();
