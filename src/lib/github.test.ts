import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchRepos, toBooks, type GitHubRepo } from './github';

const repoList: GitHubRepo[] = [
  {
    id: 1,
    name: 'skip-me',
    full_name: 'demo/skip-me',
    html_url: 'https://github.com/demo/skip-me',
    description: 'Should be filtered out',
    language: 'TypeScript',
    topics: ['client'],
    pushed_at: '2024-01-01T00:00:00Z',
    archived: false,
    fork: false,
    owner: { login: 'demo' },
  },
  {
    id: 2,
    name: 'demo',
    full_name: 'demo/demo',
    html_url: 'https://github.com/demo/demo',
    description: 'Profile repository',
    language: 'TypeScript',
    topics: ['portfolio'],
    pushed_at: '2024-06-01T00:00:00Z',
    archived: false,
    fork: false,
    owner: { login: 'demo' },
  },
  {
    id: 3,
    name: 'alpha',
    full_name: 'demo/alpha',
    html_url: 'https://github.com/demo/alpha',
    description: 'Alpha project for ordering checks',
    language: 'JavaScript',
    topics: ['ui'],
    pushed_at: '2024-06-02T00:00:00Z',
    archived: false,
    fork: false,
    owner: { login: 'demo' },
  },
  {
    id: 4,
    name: 'beta',
    full_name: 'demo/beta',
    html_url: 'https://github.com/demo/beta',
    description: 'Beta project for ordering checks',
    language: 'Python',
    topics: ['data'],
    pushed_at: '2024-06-03T00:00:00Z',
    archived: false,
    fork: false,
    owner: { login: 'demo' },
  },
  {
    id: 5,
    name: 'forked',
    full_name: 'demo/forked',
    html_url: 'https://github.com/demo/forked',
    description: 'Forked repository',
    language: 'TypeScript',
    topics: [],
    pushed_at: '2024-06-04T00:00:00Z',
    archived: false,
    fork: true,
    owner: { login: 'demo' },
  },
  {
    id: 6,
    name: 'archived',
    full_name: 'demo/archived',
    html_url: 'https://github.com/demo/archived',
    description: 'Archived repository',
    language: 'TypeScript',
    topics: [],
    pushed_at: '2024-06-05T00:00:00Z',
    archived: true,
    fork: false,
    owner: { login: 'demo' },
  },
];

describe('GitHub client', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('filters, orders, and limits books based on pinned and exclusions', () => {
    const books = toBooks(repoList, {
      user: 'demo',
      pinned: ['beta', 'alpha'],
      exclude: ['skip-me'],
      max: 3,
      overrides: {
        alpha: { title: 'Alpha custom' },
      },
    });

    expect(books.map((book) => book.title)).toEqual(['Beta', 'Alpha custom']);
    expect(books.every((book) => book.url)).toBe(true);
    expect(books.every((book) => book.color)).toBe(true);
  });

  it('humanizes names and truncates long descriptions', () => {
    const repos: GitHubRepo[] = [
      {
        id: 7,
        name: 'my_project-name',
        full_name: 'demo/my_project-name',
        html_url: 'https://github.com/demo/my_project-name',
        description: 'A'.repeat(260),
        language: 'HTML',
        topics: ['one', 'two', 'three', 'four', 'five'],
        pushed_at: '2024-06-06T00:00:00Z',
        archived: false,
        fork: false,
        owner: { login: 'demo' },
      },
    ];

    const [book] = toBooks(repos, { max: 10 });

    expect(book.title).toBe('My Project Name');
    expect(book.description.endsWith('...')).toBe(true);
    expect(book.description.length).toBeLessThanOrEqual(220);
    expect(book.tags.length).toBeLessThanOrEqual(4);
  });

  it('distributes colors across repos even when they share the same language', () => {
    const repos: GitHubRepo[] = [
      { id: 11, name: 'alpha-app', full_name: 'demo/alpha-app', html_url: 'https://github.com/demo/alpha-app', description: 'alpha', language: 'TypeScript', topics: [], pushed_at: '2024-07-01T00:00:00Z', archived: false, fork: false, owner: { login: 'demo' } },
      { id: 12, name: 'beta-app', full_name: 'demo/beta-app', html_url: 'https://github.com/demo/beta-app', description: 'beta', language: 'TypeScript', topics: [], pushed_at: '2024-07-02T00:00:00Z', archived: false, fork: false, owner: { login: 'demo' } },
      { id: 13, name: 'gamma-app', full_name: 'demo/gamma-app', html_url: 'https://github.com/demo/gamma-app', description: 'gamma', language: 'TypeScript', topics: [], pushed_at: '2024-07-03T00:00:00Z', archived: false, fork: false, owner: { login: 'demo' } },
    ];

    const colors = toBooks(repos, { max: 10 }).map((book) => book.color);
    expect(new Set(colors).size).toBeGreaterThan(1);
  });

  it('throws a helpful error for a missing GitHub user', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: 'Not Found' }), { status: 404 })),
    );

    await expect(fetchRepos('missing-user')).rejects.toThrow(/not found/i);
  });

  it('throws a rate limit message when GitHub blocks requests', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'API rate limit exceeded' }), {
          status: 403,
          headers: { 'x-ratelimit-reset': '1700000000' },
        }),
      ),
    );

    await expect(fetchRepos('demo')).rejects.toThrow(/rate limit|reset/i);
  });

  it('reuses a valid cache before touching the network', async () => {
    const cached = [{ ...repoList[2], name: 'cached-repo' }];
    localStorage.setItem(
      'github:repos:demo',
      JSON.stringify({ at: Date.now(), data: cached }),
    );

    const fetchSpy = vi.fn().mockRejectedValue(new Error('offline'));
    vi.stubGlobal('fetch', fetchSpy);

    await expect(fetchRepos('demo')).resolves.toEqual(cached);
  });

  it('falls back to stale cache when the network fails', async () => {
    const cached = [{ ...repoList[3], name: 'stale-repo' }];
    localStorage.setItem(
      'github:repos:demo',
      JSON.stringify({ at: Date.now() - 1000 * 60 * 60 * 12, data: cached }),
    );

    const fetchSpy = vi.fn().mockRejectedValue(new Error('offline'));
    vi.stubGlobal('fetch', fetchSpy);

    await expect(fetchRepos('demo')).resolves.toEqual(cached);
  });

  it('falls back to the local snapshot when there is no cache', async () => {
    const snapshot = [{ ...repoList[2], name: 'snapshot-repo' }];
    const fetchSpy = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(new Response(JSON.stringify(snapshot), { status: 200 }));

    vi.stubGlobal('fetch', fetchSpy);
    await expect(fetchRepos('demo')).resolves.toEqual(snapshot);
  });
});
