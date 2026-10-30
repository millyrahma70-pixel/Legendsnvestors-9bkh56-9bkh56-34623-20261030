import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { loginSchema } from '@/lib/siteValidations';
import { useSharedLogin } from '@/hooks/useSharedLogin';

export default function AccountLoginForm({ onForgot }: { onForgot: () => void }) {
  const { login, busy } = useSharedLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof loginSchema>>({ 
    resolver: zodResolver(loginSchema), 
    defaultValues: { identifier: '', password: '' } 
  });

  const inputWrap: any = { marginTop: '8px', background: '#1f1f1f', border: '1px solid #2f2f2f', borderRadius: '16px', display: 'flex', alignItems: 'center', padding: '14px 16px' };
  const inputStyle: any = { background: 'transparent', outline: 'none', width: '100%', color: 'white', border: 'none', fontSize: '16px' };

  return (
    <form onSubmit={handleSubmit(values => login.mutate(values))} style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '28px', padding: '24px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'white' }}>Welcome Back</h2>
      <p style={{ color: '#d4af37', marginTop: '4px', fontSize: '14px' }}>Sign in with name or phone</p>

      <div style={{ marginTop: '24px' }}>
        <label style={{ fontSize: '13px', color: '#a0a0a0' }}>Name or Phone Number</label>
        <div style={inputWrap}><span style={{ marginRight: '12px' }}>👤</span><input {...register('identifier')} placeholder="Name or phone number" disabled={busy} style={inputStyle} /></div>
        {errors.identifier && <p style={{ color: '#ff5555', fontSize: '12px', marginTop: '4px' }}>{errors.identifier.message}</p>}
      </div>

      <div style={{ marginTop: '16px' }}>
        <label style={{ fontSize: '13px', color: '#a0a0a0' }}>Password</label>
        <div style={inputWrap}><span style={{ marginRight: '12px' }}>🔒</span><input {...register('password')} type="password" placeholder="Password" disabled={busy} style={inputStyle} /></div>
        {errors.password && <p style={{ color: '#ff5555', fontSize: '12px', marginTop: '4px' }}>{errors.password.message}</p>}
      </div>

      <button type="button" onClick={onForgot} disabled={busy} style={{ marginTop: '12px', background: 'none', border: 'none', color: '#f5c518', fontSize: '14px' }}>Forgot Password?</button>

      {login.isError && <p style={{ color: '#ff6b6b', fontSize: '13px', marginTop: '8px' }}>{login.error.message}</p>}

      <button type="submit" disabled={busy} style={{ width: '100%', background: '#f5c518', color: 'black', fontWeight: 800, padding: '16px', borderRadius: '16px', fontSize: '18px', marginTop: '16px', border: 'none' }}>
        {login.isPending ? 'Signing in...' : busy ? 'Restoring session...' : 'Sign In'}
      </button>

      <p style={{ textAlign: 'center', color: '#888', fontSize: '14px', marginTop: '16px' }}>No account? <Link to="/register" style={{ color: '#f5c518', fontWeight: 600 }}>Register</Link></p>
    </form>
  );
      }
