import { describe, expect, it } from 'vitest';
import { githubUrl, linkedinUrl, mailtoUrl } from './contact';
import { profile, type Profile } from './portfolio-data';

const baseProfile: Profile = {
  ...profile,
  email: 'henrique@example.com',
  github: 'henrique-santos',
  linkedin: 'https://www.linkedin.com/in/henrique-santos/',
  role: 'Product Designer',
  bio: 'Desenvolvo experiências digitais.',
  location: 'São Paulo, Brasil',
  stack: ['React', 'TypeScript'],
  cv: { pt: 'https://example.com/cv-pt.docx', en: 'https://example.com/cv-en.docx' },
  githubFeatured: ['repo-1'],
  githubExclude: [],
  githubOverrides: {},
};

describe('contact helpers', () => {
  it('builds the GitHub URL from the profile username', () => {
    expect(githubUrl(baseProfile)).toBe('https://github.com/henrique-santos');
  });

  it('returns the LinkedIn URL as-is when present', () => {
    expect(linkedinUrl(baseProfile)).toBe('https://www.linkedin.com/in/henrique-santos/');
  });

  it('encodes accents and line breaks in mailto links', () => {
    const url = mailtoUrl({
      email: baseProfile.email,
      subject: 'Olá, mundo',
      body: 'Café\ncom pão\nÁgua',
    });

    expect(url).toContain('mailto:henrique@example.com');
    expect(url).toContain('subject=Ol%C3%A1%2C%20mundo');
    expect(url).toContain('body=Caf%C3%A9%0Acom%20p%C3%A3o%0A%C3%81gua');
  });

  it('limits mail body length to 1800 chars', () => {
    const body = 'a'.repeat(2200);
    const url = mailtoUrl({ email: baseProfile.email, subject: 'Teste', body });
    const query = url.split('?')[1] ?? '';
    const params = new URLSearchParams(query);
    expect(params.get('body')?.length ?? 0).toBeLessThanOrEqual(1800);
  });

  it('returns an empty mailto link when the profile email is missing', () => {
    const url = mailtoUrl({
      email: '',
      subject: 'Sem e-mail',
      body: 'Mensagem',
    });

    expect(url).toBe('');
  });
});
