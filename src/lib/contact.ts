import type { Profile } from './portfolio-data';

export type ContactProfile = Pick<Profile, 'email' | 'github' | 'linkedin'>;

export function githubUrl(profile: ContactProfile): string {
  const username = String(profile.github ?? '').trim();
  if (!username) return '';
  return `https://github.com/${username}`;
}

export function linkedinUrl(profile: ContactProfile): string {
  const value = String(profile.linkedin ?? '').trim();
  return value || '';
}

export function mailtoUrl({
  email = '',
  subject = '',
  body = '',
}: {
  email?: string;
  subject?: string;
  body?: string;
}): string {
  const normalizedEmail = String(email ?? '').trim();
  if (!normalizedEmail) return '';

  const safeSubject = encodeURIComponent(String(subject ?? ''));
  const safeBody = encodeURIComponent(String(body ?? '').slice(0, 1800));

  return `mailto:${normalizedEmail}?subject=${safeSubject}&body=${safeBody}`;
}
