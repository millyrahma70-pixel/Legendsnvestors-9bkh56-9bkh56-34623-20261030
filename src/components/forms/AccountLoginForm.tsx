import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserRound, LockKeyhole, AlertCircle } from 'lucide-react';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import AuthField from '@/components/forms/AuthField';
import { loginSchema } from '@/lib/siteValidations';
import { useSharedLogin } from '@/hooks/useSharedLogin';

interface Props { onForgot: () => void }

export default function AccountLoginForm({ onForgot }: Props) {
  const { login, busy } = useSharedLogin();
  
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof loginSchema>>({ 
    resolver: zodResolver(loginSchema), 
    defaultValues: { identifier: '', password: '' } 
  });

  return (
    <form onSubmit={handleSubmit(values => login.mutate(values))} className="auth-panel space-y-6" aria-labelledby="login-title">
      <div className="space-y-3">
        <h2 id="login-title" className="text-3xl font-bold tracking-tight">Welcome Back</h2>
        <p className="text-base text-muted-foreground">Sign in with name, phone or email (Cloud)</p>
      </div>

      <AuthField 
        label="Name or Phone or Email" 
        icon={UserRound} 
        registration={register('identifier')} 
        placeholder="John or 0752568482 or john@gmail.com" 
        error={errors.identifier?.message} 
        autoComplete="username" 
        disabled={busy} 
      />

      <AuthField 
        label="Password" 
        icon={LockKeyhole} 
        type="password" 
        registration={register('password')} 
        placeholder="Password" 
        error={errors.password?.message} 
        autoComplete="current-password" 
        disabled={busy} 
      />

      <Button type="button" variant="link" onClick={onForgot} disabled={busy} className="h-11 justify-start p-0 text-base font-medium text-primary">
        Forgot Password?
      </Button>

      {login.isError && (
        <p role="alert" className="flex items-start gap-2 text-[hsl(var(--error))]">
          <AlertCircle size={20} className="mt-1 shrink-0" aria-hidden="true" />
          {login.error.message}
        </p>
      )}

      <Button type="submit" disabled={busy} className="auth-submit h-16 w-full rounded-2xl text-lg font-bold">
        {login.isPending ? 'Signing in...' : busy ? 'Restoring session...' : 'Sign In'}
      </Button>

      <p className="text-center text-base text-muted-foreground">
        No account? <Link to="/register" className="inline-flex min-h-11 items-center font-semibold text-primary hover:opacity-80">Register</Link>
      </p>
      <p className="text-center text-base text-muted-foreground">One sign-in for members and administrators. Admin can see all logins in cloud.</p>
    </form>
  );
}
