import { describe, expect, it } from 'vitest';
import { parseHash, formatHash, type DeepLinkTarget } from './deep-link';

describe('parseHash', () => {
  it('returns castle for empty hash', () => {
    expect(parseHash('')).toEqual({ kind: 'castle' });
  });

  it('returns castle for bare #', () => {
    expect(parseHash('#')).toEqual({ kind: 'castle' });
  });

  it('returns simple for #simples', () => {
    expect(parseHash('#simples')).toEqual({ kind: 'simple' });
  });

  it.each([
    ['#biblioteca', 'B'],
    ['#sala-do-trono', 'T'],
    ['#laboratorio', 'L'],
    ['#arsenal', 'R'],
    ['#aposentos', 'A'],
  ] as [string, string][])('parses %s → room %s', (hash, id) => {
    expect(parseHash(hash)).toEqual({ kind: 'room', id });
  });

  it('returns null for unknown hash', () => {
    expect(parseHash('#desconhecido')).toBeNull();
    expect(parseHash('#xyz')).toBeNull();
  });
});

describe('formatHash', () => {
  it('returns empty string for castle', () => {
    expect(formatHash({ kind: 'castle' })).toBe('');
  });

  it('returns #simples for simple', () => {
    expect(formatHash({ kind: 'simple' })).toBe('#simples');
  });

  it.each([
    ['B', '#biblioteca'],
    ['T', '#sala-do-trono'],
    ['L', '#laboratorio'],
    ['R', '#arsenal'],
    ['A', '#aposentos'],
  ] as [string, string][])('formats room %s → %s', (id, hash) => {
    expect(formatHash({ kind: 'room', id: id as DeepLinkTarget & { kind: 'room' } extends { id: infer I } ? I : never })).toBe(hash);
  });
});

describe('round-trip', () => {
  it.each([
    { kind: 'castle' } as DeepLinkTarget,
    { kind: 'simple' } as DeepLinkTarget,
    { kind: 'room', id: 'B' } as DeepLinkTarget,
    { kind: 'room', id: 'T' } as DeepLinkTarget,
    { kind: 'room', id: 'L' } as DeepLinkTarget,
    { kind: 'room', id: 'R' } as DeepLinkTarget,
    { kind: 'room', id: 'A' } as DeepLinkTarget,
  ])('formatHash → parseHash is identity for %o', (target) => {
    expect(parseHash(formatHash(target))).toEqual(target);
  });
});
