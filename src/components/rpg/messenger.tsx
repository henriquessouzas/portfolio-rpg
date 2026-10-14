import { Mail } from 'lucide-react';
import { useState } from 'react';
import { githubUrl, linkedinUrl, mailtoUrl } from '@/lib/contact';
import type { Profile } from '@/lib/portfolio-data';
import { useLang } from '@/hooks/use-lang';

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.33-3.37-1.33-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.54 2.36 1.1 2.93.84.09-.66.35-1.1.64-1.35-2.22-.25-4.55-1.11-4.55-4.96 0-1.1.39-2 1.03-2.7-.1-.25-.45-1.29.1-2.69 0 0 .84-.27 2.75 1.02A9.51 9.51 0 0 1 12 6.78c.85 0 1.71.12 2.51.35 1.9-1.29 2.74-1.02 2.74-1.02.55 1.4.2 2.44.1 2.69.64.7 1.03 1.6 1.03 2.7 0 3.86-2.34 4.71-4.57 4.96.36.32.68.94.68 1.9v2.81c0 .26.18.58.69.48A10 10 0 0 0 12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M6.94 8.5A1.56 1.56 0 1 1 6.9 5.38a1.56 1.56 0 0 1 .04 3.12ZM5.5 10.12h2.9v8.38H5.5zm5.1 0h2.77v1.14h.04c.39-.74 1.33-1.52 2.74-1.52 2.93 0 3.47 1.93 3.47 4.44v4.32h-2.9v-4.04c0-1-.02-2.28-1.39-2.28-1.39 0-1.6 1.08-1.6 2.2v4.12h-2.9z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Messenger({ profile }: { profile: Profile }) {
  const { t } = useLang();
  const firstName = profile.name.trim().split(/\s+/)[0] || 'amigo';
  const email = profile.email.trim();
  const github = profile.github.trim();
  const linkedin = profile.linkedin.trim();
  const [showForm, setShowForm] = useState(false);

  const emailLink = email ? mailtoUrl({ email, subject: 'Contato pelo portfólio', body: `Olá, ${firstName}!\n\n` }) : '';

  const handleEmailClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!emailLink) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    setShowForm(true);
  };

  return (
    <div className="messenger-popup">
      <p className="messenger-intro">{t.messengerIntro}</p>

      <div className="messenger-actions">
        {email ? (
          <>
            <a
              className="messenger-link"
              href={emailLink}
              aria-label={`${t.sendEmail} ${email}`}
              onClick={handleEmailClick}
            >
              <span className="messenger-icon" aria-hidden="true">
                <Mail size={18} />
              </span>
              <span>{t.sendEmail}</span>
            </a>

            {showForm ? (
              <form
                className="messenger-form"
                action="https://formsubmit.co/henriquetrabalhodossantos@gmail.com"
                method="POST"
              >
                <input type="hidden" name="_subject" value="Contato pelo portfólio" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_replyto" value={email} />

                <label>
                  <span>{t.yourName}</span>
                  <input type="text" name="name" placeholder={t.yourName} required />
                </label>
                <label>
                  <span>{t.yourEmail}</span>
                  <input type="email" name="email" placeholder="seu@email.com" required />
                </label>
                <label>
                  <span>{t.message}</span>
                  <textarea name="message" rows={5} placeholder={t.writeMessage} required />
                </label>
                <button type="submit" className="messenger-submit">
                  {t.sendMessage}
                </button>
              </form>
            ) : null}

            <span className="messenger-address">{email}</span>
          </>
        ) : null}

        {github ? (
          <a
            className="messenger-link"
            href={githubUrl(profile)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.openGitHub}
          >
            <span className="messenger-icon" aria-hidden="true">
              <GitHubMark />
            </span>
            <span>GitHub</span>
          </a>
        ) : null}

        {linkedin ? (
          <a
            className="messenger-link"
            href={linkedinUrl(profile)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.openLinkedIn}
          >
            <span className="messenger-icon" aria-hidden="true">
              <LinkedInMark />
            </span>
            <span>LinkedIn</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
