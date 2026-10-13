import { useEffect, useState } from 'react';
import { fetchRepos, toBooks } from '@/lib/github';
import { profile, type Book } from '@/lib/portfolio-data';

export type GithubBooksStatus = 'loading' | 'ready' | 'error';

export function useGithubBooks() {
  const [status, setStatus] = useState<GithubBooksStatus>('loading');
  const [books, setBooks] = useState<Book[]>([]);
  const [stale, setStale] = useState(false);

  useEffect(() => {
    let active = true;
    const user = profile.github.trim();
    const config = {
      user,
      pinned: profile.githubFeatured,
      exclude: profile.githubExclude,
      overrides: profile.githubOverrides,
      max: 12,
    };

    const updateFromRepos = (repos: Awaited<ReturnType<typeof fetchRepos>>) => {
      const next = toBooks(repos, config);
      if (!active) return;
      setBooks(next);
      setStatus('ready');
      setStale(false);
    };

    async function loadSnapshot() {
      try {
        const response = await fetch(new URL('../data/github-projects.json', import.meta.url).href, {
          cache: 'no-store',
        });
        if (!response.ok) {
          return [] as Awaited<ReturnType<typeof fetchRepos>>;
        }

        const payload = (await response.json()) as Awaited<ReturnType<typeof fetchRepos>>;
        return Array.isArray(payload) ? payload : [];
      } catch {
        return [] as Awaited<ReturnType<typeof fetchRepos>>;
      }
    }

    if (!user) {
      setStatus('error');
      setBooks([]);
      setStale(false);
      return () => {
        active = false;
      };
    }

    void (async () => {
      const snapshot = await loadSnapshot();
      const snapshotBooks = toBooks(snapshot, config);

      if (!active) return;

      setBooks(snapshotBooks);
      setStatus(snapshotBooks.length > 0 ? 'ready' : 'loading');
      setStale(snapshotBooks.length > 0);

      try {
        const repos = await fetchRepos(user);
        if (!active) return;
        updateFromRepos(repos);
      } catch (error) {
        if (!active) return;

        if (snapshotBooks.length === 0) {
          setStatus('error');
          setBooks([]);
          setStale(false);
          return;
        }

        setStatus('ready');
        setStale(true);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { status, books, stale, user: profile.github };
}
