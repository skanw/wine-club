import { useState } from 'react';
import { api } from 'wasp/client/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && EMAIL_REGEX.test(trimmed);
}

type Status = 'idle' | 'loading' | 'success' | 'error';

interface NotifyMeSectionProps {
  /** When true, render inline (e.g. inside Hero) without section padding/background */
  compact?: boolean;
}

export default function NotifyMeSection({ compact }: NotifyMeSectionProps = {}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage('');

    if (!isValidEmail(email)) {
      setStatus('error');
      setErrorMessage('Veuillez entrer une adresse email valide.');
      return;
    }

    setStatus('loading');
    try {
      const res = await api.post('/notify-me', {
        email: email.trim().toLowerCase(),
      });
      if (res.data?.success) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
        setErrorMessage(res.data?.message ?? 'Une erreur est survenue.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Une erreur est survenue. Réessayez.');
    }
  }

  const content = (
    <div className="mx-auto max-w-xl flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-vintage-wine text-center">
        Prévenez-moi quand c'est prêt
      </h2>

      {status === 'success' ? (
        <p className="mt-6 text-lg font-light text-vintage-wine/80 text-center">
          Merci, nous vous préviendrons.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 w-full flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="votre@email.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            className="flex-1 min-w-0 rounded-full border-vintage-wine/30 bg-white text-vintage-wine placeholder:text-vintage-wine/50"
            aria-label="Email"
          />
          <Button
            type="submit"
            size="lg"
            variant="default"
            className="rounded-full px-8 shrink-0"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Envoi...' : 'Prévenez-moi'}
          </Button>
        </form>
      )}

      {status === 'error' && errorMessage && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400 text-center" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );

  if (compact) {
    return (
      <div id="notify-me" className="mt-12 sm:mt-16 w-full">
        {content}
      </div>
    );
  }

  return (
    <section
      id="notify-me"
      className="relative py-16 sm:py-20 w-full"
      style={{ backgroundColor: '#F4F4F0' }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {content}
      </div>
    </section>
  );
}
