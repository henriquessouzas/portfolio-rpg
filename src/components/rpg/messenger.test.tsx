// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import { Messenger } from './messenger';
import { profile } from '@/lib/portfolio-data';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('Messenger', () => {
  it('renders email, GitHub and LinkedIn links with the correct href and rel values', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);

    act(() => {
      root.render(<Messenger profile={profile} />);
    });

    const emailLink = host.querySelector('a[aria-label="Enviar e-mail para henriquetrabalhodossantos@gmail.com"]') as HTMLAnchorElement;
    const githubLink = host.querySelector('a[aria-label="Abrir o GitHub em uma nova aba"]') as HTMLAnchorElement;
    const linkedinLink = host.querySelector('a[aria-label="Abrir o LinkedIn em uma nova aba"]') as HTMLAnchorElement;

    expect(emailLink).not.toBeNull();
    expect(emailLink.href).toContain('mailto:henriquetrabalhodossantos@gmail.com');
    expect(emailLink.getAttribute('target')).toBeNull();

    expect(githubLink).not.toBeNull();
    expect(githubLink.href).toBe('https://github.com/henriquessouzas');
    expect(githubLink.getAttribute('target')).toBe('_blank');
    expect(githubLink.getAttribute('rel')).toBe('noopener noreferrer');

    expect(linkedinLink).not.toBeNull();
    expect(linkedinLink.href).toBe('https://www.linkedin.com/in/henriquesdesouzas/?isSelfProfile=true');
    expect(linkedinLink.getAttribute('target')).toBe('_blank');
    expect(linkedinLink.getAttribute('rel')).toBe('noopener noreferrer');

    act(() => root.unmount());
    host.remove();
  });

  it('decodes the mailto subject and body from the encoded URL', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);

    act(() => {
      root.render(<Messenger profile={profile} />);
    });

    const emailLink = host.querySelector('a[aria-label="Enviar e-mail para henriquetrabalhodossantos@gmail.com"]') as HTMLAnchorElement;
    const url = new URL(emailLink.href);

    expect(url.searchParams.get('subject')).toBe('Contato pelo portfólio');
    expect(url.searchParams.get('body')).toBe('Olá, Henrique!\n\n');

    act(() => root.unmount());
    host.remove();
  });

  it('hides empty profile channels and renders a proper form only when an email exists', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);

    act(() => {
      root.render(
        <Messenger
          profile={{
            ...profile,
            email: '',
            github: '',
            linkedin: '',
          }}
        />,
      );
    });

    expect(host.querySelector('form')).toBeNull();
    expect(host.querySelector('a[aria-label="Enviar e-mail para "]')).toBeNull();
    expect(host.querySelector('a[aria-label="Abrir o GitHub em uma nova aba"]')).toBeNull();
    expect(host.querySelector('a[aria-label="Abrir o LinkedIn em uma nova aba"]')).toBeNull();

    act(() => root.unmount());
    host.remove();
  });

  it('renders a real browser form for the email action', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);

    act(() => {
      root.render(<Messenger profile={profile} />);
    });

    const emailLink = host.querySelector('a[aria-label="Enviar e-mail para henriquetrabalhodossantos@gmail.com"]') as HTMLAnchorElement;
    act(() => emailLink.click());

    const form = host.querySelector('form.messenger-form') as HTMLFormElement;
    expect(form).not.toBeNull();
    expect(form.getAttribute('method')).toBe('POST');
    expect(form.getAttribute('action')).toBe('https://formsubmit.co/henriquetrabalhodossantos@gmail.com');
    expect(form.querySelector('input[name="name"]')).not.toBeNull();
    expect(form.querySelector('input[name="email"]')).not.toBeNull();
    expect(form.querySelector('textarea[name="message"]')).not.toBeNull();

    act(() => root.unmount());
    host.remove();
  });
});
