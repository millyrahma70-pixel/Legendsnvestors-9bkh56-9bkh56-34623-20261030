import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
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
    <form onSubmit={handleSubmit(values => login.mutate(values))} className="w-full bg-[#141414] border border-[#2a2a2a] rounded-[28px] p-6 space-y-5">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h2>
        <p className="text-sm text-[#d4af37]">Sign in with name or phone</p>
      </div>

      <div>
        <label className="text-sm text-[#a0a0a0]">Name or Phone Number</label>
        <div className="mt-2 bg-[#1f1f1f] border border-[#2f2f2f] rounded-2xl flex items-center px-4 py-3.5">
          <span className="mr-3 opacity-60">👤</span>
          <input {...register('identifier')} placeholder="Name or phone number" disabled={busy} className="bg-transparent outline-none w-full text-white placeholder:text-[#666]" />
        </div>
        {errors.identifier && <p className="text-red-500 text-xs mt-1">{errors.identifier.message}</p>}
      </div>

      <div>
        <label className="text-sm text-[#a0a0a0]">Password</label>
        <div className="mt-2 bg-[#1f1f1f] border border-[#2f2f2f] rounded-2xl flex items-center px-4 py-3.5">
          <span className="mr-3 opacity-60">🔒</span>
          <input {...register('password')} type="password" placeholder="Password" disabled={busy} className="bg-transparent outline-none w-full text-white placeholder:text-[#666]" />
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <button type="button" onClick={onForgot} disabled={busy} className="text-sm text-[#f5c518]">Forgot Password?</button>

      {login.isError && <p className="text-red-400 text-sm">{login.error.message}</p>}

      <button type="submit" disabled={busy} className="w-full bg-[#f5c518] text-black font-bold py-4 rounded-2xl text-lg hover:bg-[#e6b800]">
        {login.isPending ? 'Signing in...' : busy ? 'Restoring session...' : 'Sign In'}
      </button>

      <p className="text-center text-sm text-[#888]">No account? <Link to="/register" className="text-[#f5c518] font-semibold">Register</Link></p>
      <p className="text-center text-xs text-[#666]">One sign-in for members and administrators.</p>
    </form>
  );
}
