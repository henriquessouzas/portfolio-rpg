import type { RoomId } from './portfolio-data';

export type DeepLinkTarget =
  | { kind: 'castle' }
  | { kind: 'simple' }
  | { kind: 'room'; id: RoomId };

const SLUG_TO_ID: Record<string, RoomId> = {
  biblioteca: 'B',
  'sala-do-trono': 'T',
  laboratorio: 'L',
  arsenal: 'R',
  aposentos: 'A',
};

const ID_TO_SLUG: Record<RoomId, string> = {
  B: 'biblioteca',
  T: 'sala-do-trono',
  L: 'laboratorio',
  R: 'arsenal',
  A: 'aposentos',
};

/** Parses window.location.hash into a DeepLinkTarget, or null if unknown. */
export function parseHash(hash: string): DeepLinkTarget | null {
  const slug = hash.replace(/^#/, '');
  if (!slug) return { kind: 'castle' };
  if (slug === 'simples') return { kind: 'simple' };
  const id = SLUG_TO_ID[slug];
  if (id) return { kind: 'room', id };
  return null;
}

/** Formats a DeepLinkTarget into a hash string (e.g. '#biblioteca'). */
export function formatHash(target: DeepLinkTarget): string {
  if (target.kind === 'castle') return '';
  if (target.kind === 'simple') return '#simples';
  return `#${ID_TO_SLUG[target.id]}`;
}
