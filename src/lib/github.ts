import type { Book } from './portfolio-data';

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  topics?: string[];
  pushed_at: string;
  updated_at?: string;
  stargazers_count?: number;
  archived: boolean;
  fork: boolean;
  owner: { login: string };
};

export type GitHubBooksConfig = {
  pinned?: string[];
  exclude?: string[];
  max?: number;
  user?: string;
  overrides?: Record<string, { title?: string; description?: string }>;
};

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const SNAPSHOT_PATH = new URL('../data/github-projects.json', import.meta.url).href;

function humanizeRepoName(name: string): string {
  return name
    .replace(/[-_]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function truncateDescription(raw: string, maxLength = 220): string {
  const value = raw.trim();
  if (value.length <= maxLength) {
    return value;
  }

  const truncated = value.slice(0, Math.max(0, maxLength - 3)).trimEnd();
  return `${truncated}...`;
}

function buildTags(language: string | null, topics: string[] | undefined): string[] {
  const values = [language, ...(topics ?? [])]
    .filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
    .map((tag) => tag.trim());

  return Array.from(new Set(values)).slice(0, 4);
}

function getBookColor(language: string | null, index = 0): Book['color'] {
  const normalized = (language ?? '').toLowerCase();
  const palette: Book['color'][] = ['mana', 'gold', 'forest', 'ember', 'royal'];
  const languagePalette: Record<string, Book['color'][]> = {
    typescript: ['mana', 'royal', 'forest', 'gold'],
    javascript: ['gold', 'ember', 'mana', 'royal'],
    python: ['forest', 'mana', 'gold', 'royal'],
    html: ['ember', 'gold', 'royal', 'mana'],
    css: ['ember', 'royal', 'gold', 'forest'],
  };

  const options = languagePalette[normalized] ?? palette;
  return options[index % options.length] ?? options[0];
}

function readCacheEntry(user: string): { at: number; data: GitHubRepo[] } | null {
  try {
    const key = `github:repos:${user}`;
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { at?: number; data?: GitHubRepo[] };
    if (typeof parsed.at !== 'number' || !Array.isArray(parsed.data)) {
      return null;
    }

    return { at: parsed.at, data: parsed.data };
  } catch {
    return null;
  }
}

function writeCacheEntry(user: string, data: GitHubRepo[]): void {
  try {
    window.localStorage.setItem(
      `github:repos:${user}`,
      JSON.stringify({
        at: Date.now(),
        data,
      }),
    );
  } catch {
    // ignore cache write errors
  }
}

async function readSnapshot(): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(SNAPSHOT_PATH, { cache: 'no-store' });
    if (!response.ok) return [];

    const payload = (await response.json()) as GitHubRepo[];
    return Array.isArray(payload) ? payload : [];
  } catch {
    return [];
  }
}

export async function fetchRepos(
  user: string,
  opts: { signal?: AbortSignal } = {},
): Promise<GitHubRepo[]> {
  const normalizedUser = user.trim();
  if (!normalizedUser) {
    return [];
  }

  const cached = readCacheEntry(normalizedUser);
  if (cached && Date.now() - cached.at <= CACHE_TTL_MS) {
    return cached.data;
  }

  const controller = new AbortController();
  const handleAbort = () => controller.abort();
  if (opts.signal) {
    if (opts.signal.aborted) {
      controller.abort();
    } else {
      opts.signal.addEventListener('abort', handleAbort, { once: true });
    }
  }

  const timeout = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(normalizedUser)}/repos?per_page=100&sort=pushed&type=owner`,
      {
        headers: { Accept: 'application/vnd.github+json' },
        signal: controller.signal,
      },
    );

    if (response.status === 404) {
      throw new Error(`GitHub user "${normalizedUser}" was not found.`);
    }

    if (response.status === 403 || response.status === 429) {
      const resetHeader = response.headers.get('x-ratelimit-reset');
      const resetValue = Number(resetHeader ?? '0');
      const resetText = Number.isFinite(resetValue) && resetValue > 0
        ? ` Reset at ${new Date(resetValue * 1000).toISOString()}.`
        : '';
      throw new Error(`GitHub rate limit exceeded.${resetText}`);
    }

    if (!response.ok) {
      let message = response.statusText || 'GitHub request failed.';
      try {
        const payload = (await response.json()) as { message?: string };
        if (typeof payload.message === 'string' && payload.message.trim()) {
          message = payload.message;
        }
      } catch {
        // ignore JSON parse failures
      }

      throw new Error(message);
    }

    const payload = (await response.json()) as GitHubRepo[];
    const repos = Array.isArray(payload) ? payload : [];
    writeCacheEntry(normalizedUser, repos);
    return repos;
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      if (message.includes('not found') || message.includes('rate limit') || message.includes('timed out')) {
        throw error;
      }

      if (message.includes('abort')) {
        throw new Error('GitHub request timed out after 8 seconds.');
      }
    }

    if (cached) {
      return cached.data;
    }

    return readSnapshot();
  } finally {
    window.clearTimeout(timeout);
    if (opts.signal) {
      opts.signal.removeEventListener('abort', handleAbort);
    }
  }
}

function decodeGitHubBase64(raw: string): string {
  const sanitized = raw.replace(/\s+/g, '');
  if (!sanitized) return '';

  const binary = atob(sanitized);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

export function fetchReadmeForRepo(repoUrl: string): Promise<string> {
  if (!repoUrl) return Promise.resolve('');

  try {
    const parsed = new URL(repoUrl);
    const pathSegments = parsed.pathname.split('/').filter(Boolean);
    const owner = pathSegments.at(-2);
    const repo = pathSegments.at(-1);

    if (!owner || !repo) return Promise.resolve('');

    return fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then(async (response) => {
        if (!response.ok) return '';
        const payload = (await response.json()) as { content?: string; encoding?: string };
        const content = payload.content ?? '';
        if (!content) return '';

        try {
          return decodeGitHubBase64(content);
        } catch {
          return '';
        }
      })
      .catch(() => '');
  } catch {
    return Promise.resolve('');
  }
}

export function toBooks(repos: GitHubRepo[], config: GitHubBooksConfig = {}): Book[] {
  const pinned = config.pinned ?? [];
  const excluded = new Set((config.exclude ?? []).map((name) => name.toLowerCase()));
  const max = Number.isFinite(config.max) ? Math.max(0, Number(config.max ?? 12)) : 12;
  const user = (config.user ?? '').trim().toLowerCase();
  const overrides = config.overrides ?? {};
  const pinnedOrder = new Map(pinned.map((name, index) => [name.toLowerCase(), index]));

  const filtered = repos.filter((repo) => {
    if (repo.fork || repo.archived) return false;
    if (user && repo.name.toLowerCase() === user) return false;
    if (excluded.has(repo.name.toLowerCase())) return false;
    return true;
  });

  const sorted = [...filtered].sort((left, right) => {
    const leftPinned = pinnedOrder.get(left.name.toLowerCase());
    const rightPinned = pinnedOrder.get(right.name.toLowerCase());

    if (leftPinned !== undefined || rightPinned !== undefined) {
      if (leftPinned === undefined) return 1;
      if (rightPinned === undefined) return -1;
      return (leftPinned ?? 0) - (rightPinned ?? 0);
    }

    return new Date(right.pushed_at).getTime() - new Date(left.pushed_at).getTime();
  });

  return sorted.slice(0, max).map((repo, index) => {
    const override = overrides[repo.name] ?? overrides[repo.full_name];
    const title = override?.title ?? humanizeRepoName(repo.name);
    const descriptionSource = override?.description ?? repo.description ?? 'Sem descrição ainda.';
    const description = truncateDescription(descriptionSource);
    const tags = buildTags(repo.language, repo.topics);

    return {
      title,
      subtitle: repo.language ?? 'Projeto',
      description,
      tags,
      color: getBookColor(repo.language, index),
      url: repo.html_url,
      stars: typeof repo.stargazers_count === 'number' ? repo.stargazers_count : undefined,
      updatedAt: repo.pushed_at ?? repo.updated_at,
    } satisfies Book;
  });
}
