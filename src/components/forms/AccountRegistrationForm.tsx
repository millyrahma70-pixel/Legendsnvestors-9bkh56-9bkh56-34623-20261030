import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { UserRound, Phone, Mail, LockKeyhole, Gift, Check, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import AuthField from '@/components/forms/AuthField';
import RegistrationBonus from '@/components/features/RegistrationBonus';
import RegistrationVerification from '@/components/features/RegistrationVerification';
import { registrationSchema, type RegistrationValues } from '@/lib/siteValidations';
import { usePublicSite } from '@/hooks/useSite';

export default function AccountRegistrationForm() {
  const [params] = useSearchParams();
  const publicSite = usePublicSite();
  const [details, setDetails] = useState<RegistrationValues | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegistrationValues>({ 
    resolver: zodResolver(registrationSchema), 
    defaultValues: { 
      name: '', 
      email: '', // RESTORED FOR CLOUD
      phone: '', 
      password: '', 
      confirm: '', 
      referral: params.get('ref') || '' 
    } 
  });

  const referral = watch('referral');

  if (publicSite.isError) return (
    <section role="alert" className="auth-panel space-y-4">
      <h2 className="text-xl font-semibold">Registration settings unavailable</h2>
      <p className="text-muted-foreground">{publicSite.error.message}</p>
      <Button onClick={() => void publicSite.refetch()} disabled={publicSite.isFetching}>Retry connection</Button>
    </section>
  );

  const closed = Boolean(publicSite.data?.settings.config.maintenance || publicSite.data?.settings.config.registrationOpen === false);
  const disabled = closed || publicSite.isPending;

  // Step 2 - Email verification (saves to cloud)
  if (details) return (
    <div className="auth-panel space-y-4">
      {closed && <p role="alert" className="flex gap-2 text-[hsl(var(--error))]"><AlertCircle size={20} />Registration is currently paused.</p>}
      <RegistrationVerification values={details} disabled={disabled} onBack={() => setDetails(null)} />
    </div>
  );

  // Step 1 - Account details (bonus shows ONCE here)
  return (
    <div className="space-y-6">
      {publicSite.data && <RegistrationBonus amount={publicSite.data.settings.config.registrationBonus} />}
      
      <form onSubmit={handleSubmit(values => setDetails(values))} className="auth-panel space-y-6" aria-labelledby="registration-title">
        <div className="space-y-2">
          <h2 id="registration-title" className="text-3xl font-bold tracking-tight">Create Account</h2>
          <p className="text-base text-primary">Step 1 of 2 · Account details (Cloud saved)</p>
        </div>

        <AuthField label="Full Name" icon={UserRound} registration={register('name')} placeholder="e.g. John Doe" error={errors.name?.message} autoComplete="name" disabled={disabled} />
        
        <AuthField label="Email (for cloud + admin)" icon={Mail} registration={register('email')} placeholder="e.g. john@gmail.com" error={errors.email?.message} autoComplete="email" disabled={disabled} />
        
        <AuthField label="Phone Number" icon={Phone} type="tel" registration={register('phone')} placeholder="e.g. 0751234567" error={errors.phone?.message} autoComplete="tel" disabled={disabled} />
        
        <AuthField label="Password" icon={LockKeyhole} type="password" registration={register('password')} placeholder="At least 6 characters" error={errors.password?.message} autoComplete="new-password" disabled={disabled} />
        
        <AuthField label="Confirm Password" icon={LockKeyhole} type="password" registration={register('confirm')} placeholder="Re-enter password" error={errors.confirm?.message} autoComplete="new-password" disabled={disabled} />
        
        <div className="space-y-2">
          <AuthField label="Referral Code (Optional)" icon={Gift} registration={register('referral')} placeholder="Enter referral code if you have one" error={errors.referral?.message} highlighted={Boolean(referral) && !errors.referral} disabled={disabled} />
          {referral && !errors.referral && <p className="flex items-start gap-2 break-all text-base text-primary"><Check size={18} className="mt-1 shrink-0" />Referral added: {referral}</p>}
        </div>

        <p className="text-base leading-relaxed text-muted-foreground">Next, verify your email to activate your account and receive the bonus. After activation, sign in with your name or phone number. Admin will see you in cloud.</p>
        
        {closed && <p role="alert" className="flex gap-2 text-[hsl(var(--error))]"><AlertCircle size={20} />Registration is currently paused.</p>}
        
        <Button type="submit" disabled={disabled} className="auth-submit h-16 w-full rounded-2xl text-lg font-bold">
          {publicSite.isPending ? 'Loading registration settings...' : 'Register & Claim Bonus'}
        </Button>
        
        <p className="text-center text-base text-muted-foreground">Already have an account? <Link to="/login" className="inline-flex min-h-11 items-center font-semibold text-primary hover:opacity-80">Sign In</Link></p>
      </form>
    </div>
  );
      }
