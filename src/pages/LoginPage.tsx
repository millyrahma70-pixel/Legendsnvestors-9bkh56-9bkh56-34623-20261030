import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SiteAuthLayout from '@/components/layout/SiteAuthLayout';
import AccountLoginForm from '@/components/forms/AccountLoginForm';
import AccountRecoveryForm from '@/components/forms/AccountRecoveryForm';
export default function LoginPage() {
  const [recovery, setRecovery] = useState(false);
  return <SiteAuthLayout title="Welcome to Legend">{recovery ? <section className="auth-panel space-y-6">
    <AccountRecoveryForm />
    <Link to="/admin/recovery" className="inline-flex min-h-11 items-center text-base font-semibold text-primary hover:opacity-80">Recover administrator access</Link>
    <Button type="button" variant="ghost" className="min-h-11 w-full rounded-xl text-base text-primary" onClick={() => setRecovery(false)}>Back to Sign In</Button>
  </section> : <AccountLoginForm onForgot={() => setRecovery(true)} />}</SiteAuthLayout>;
}
