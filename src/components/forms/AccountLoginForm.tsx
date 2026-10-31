import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  identifier: z.string().min(3, "Enter phone"),
  password: z.string().min(3, "Enter password"),
});
type LoginValues = z.infer<typeof loginSchema>;

export default function AccountLoginForm({ onForgot }: { onForgot?: () => void }) {
  const navigate = useNavigate();
  const [isLogining, setIsLogining] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '' }
  });
  const wrap: any = { background: '#1e1e1e', border: '1px solid #333', borderRadius: '16px', padding: '14px 16px', display: 'flex', alignItems: 'center', marginTop: '6px' };
  const inp: any = { background: 'transparent', border: 'none', outline: 'none', color: 'white', width: '100%', fontSize: '16px' };
  const label: any = { color: '#aaa', fontSize: '13px', marginTop: '16px', display: 'block' };
  const err: any = { color: '#ff5555', fontSize: '12px', marginTop: '4px' };

  const onSubmit = (values: LoginValues) => {
    setIsLogining(true);
    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem('legend_users') || '[]');
        const user = users.find((u: any) => u.phone === values.identifier && u.password === values.password);
        if (!user) { alert('Wrong phone or password! Please register first.'); setIsLogining(false); return; }
        localStorage.setItem('legend_current_user', JSON.stringify(user));
        navigate('/dashboard');
      } finally { setIsLogining(false); }
    }, 300);
  };

  return (
    <div style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: '28px', padding: '24px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: 'white' }}>Welcome Back</h2>
      <label style={label}>Phone Number</label>
      <div style={wrap}>📞 <input {...register('identifier')} placeholder="e.g. +256" style={{ ...inp, marginLeft: '10px' }} /></div>
      {errors.identifier && <p style={err}>{errors.identifier.message}</p>}
      <label style={label}>Password</label>
      <div style={wrap}>🔒 <input {...register('password')} type="password" placeholder="Password" style={{ ...inp, marginLeft: '10px' }} /></div>
      {errors.password && <p style={err}>{errors.password.message}</p>}
      <button type="button" onClick={handleSubmit(onSubmit)} disabled={isLogining} style={{ width: '100%', background: '#f5c518', color: 'black', fontWeight: 800, padding: '16px', borderRadius: '16px', border: 'none', fontSize: '18px', marginTop: '20px' }}>{isLogining ? 'Signing In...' : 'Sign In'}</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
        <button type="button" onClick={onForgot} style={{ background: 'none', border: 'none', color: '#888', fontSize: '13px' }}>Forgot Password?</button>
        <Link to="/register" style={{ color: '#f5c518', fontSize: '13px' }}>Create Account</Link>
      </div>
    </div>
  );
}
