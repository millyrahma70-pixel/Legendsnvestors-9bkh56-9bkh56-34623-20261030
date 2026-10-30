import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import AdminSignInBrand from '@/components/layout/AdminSignInBrand';
import AdminPasswordRecovery from '@/components/features/AdminPasswordRecovery';

export default function AdminRecoveryPage() {
  return <main className="admin-theme admin-login min-h-screen bg-background px-6 py-8 text-foreground sm:px-8 lg:px-12 lg:py-16">
    <div className="admin-login-layout mx-auto max-w-6xl">
      <AdminSignInBrand />
      <section aria-labelledby="admin-recovery-title" className="admin-login-form">
        <h2 id="admin-recovery-title" className="text-2xl font-bold tracking-tight sm:text-3xl">Reset admin password</h2>
        <p className="mb-8 mt-4 text-muted-foreground">Verify your admin email once and choose a new password. Your normal sign-in will still use only your number and password.</p>
        <AdminPasswordRecovery />
        <p className="mt-6 flex items-center justify-center gap-2 text-base text-muted-foreground"><ShieldCheck size={18} className="shrink-0 text-primary" aria-hidden="true" />Administrator permissions stay protected</p>
        <Link to="/login" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg font-semibold text-primary transition-opacity hover:opacity-80"><ArrowLeft size={18} aria-hidden="true" />Back to shared sign-in</Link>
      </section>
    </div>
  </main>;
}
