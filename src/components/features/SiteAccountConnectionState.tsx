import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props { error?: string; loading?: boolean; onRetry?: () => void }

export default function SiteAccountConnectionState({ error, loading = false, onRetry }: Props) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    setSlow(false);
    if (!loading) return;
    const timer = setTimeout(() => setSlow(true), 6000);
    return () => clearTimeout(timer);
  }, [loading]);
  const Icon = error ? AlertCircle : Wallet;
  return <main className="grid min-h-screen place-items-center bg-background p-6 text-foreground">
    <section aria-live="polite" aria-busy={loading} className="w-full max-w-xl space-y-6 rounded-3xl border border-primary/30 bg-card p-6 sm:p-8">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10"><Icon size={28} className="text-primary" aria-hidden="true" /></div>
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">{error ? 'Account connection unavailable' : 'Connecting to your wallet'}</h1>
        <p className="text-base leading-relaxed text-muted-foreground">{error || (slow ? 'Cloud is responding slowly. This request will stop after 20 seconds so you can retry.' : 'Retrieving your saved account and wallet records from Cloud.')}</p>
      </div>
      {error && onRetry && <Button className="min-h-12 w-full rounded-xl text-base" disabled={loading} onClick={onRetry}>{loading ? 'Reconnecting…' : 'Retry connection'}</Button>}
      {error && <Link to="/login" className="inline-flex min-h-11 items-center rounded-lg font-semibold text-primary transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-ring">Return to Sign In</Link>}
      <p className="text-base leading-relaxed text-muted-foreground">Loading this screen does not submit a recharge or withdrawal.</p>
    </section>
  </main>;
}
