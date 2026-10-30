import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import AdminLoginField from '@/components/forms/AdminLoginField';
import { adminLoginSchema, type AdminLoginValues } from '@/lib/adminValidations';
import { signInAdmin } from '@/lib/adminAuth';
import { ADMIN_LOGIN_NUMBER } from '@/constants/admin';

export default function AdminPasswordLoginForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginValues>({ resolver: zodResolver(adminLoginSchema), defaultValues: { phone: ADMIN_LOGIN_NUMBER, password: '' } });
  const login = useMutation({ mutationFn: (values: AdminLoginValues) => signInAdmin(values.phone, values.password), onSuccess: () => { toast.success('Admin signed in'); navigate('/admin', { replace: true }); }, onError: (error: Error) => toast.error(error.message) });
  return <form noValidate onSubmit={handleSubmit(values => login.mutate(values))} aria-busy={login.isPending} className="space-y-6">
    <AdminLoginField label="Phone Number" registration={register('phone')} error={errors.phone?.message} disabled={login.isPending} />
    <AdminLoginField label="Password" password registration={register('password')} error={errors.password?.message} disabled={login.isPending} />
    {login.isError && <p role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-[hsl(var(--error))]"><AlertCircle size={20} className="mt-1 shrink-0" aria-hidden="true" />{login.error.message}</p>}
    <Button type="submit" disabled={login.isPending} className="admin-login-submit h-16 w-full rounded-2xl text-lg font-semibold transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:transform-none disabled:opacity-50">
      {login.isPending ? 'Signing in…' : 'Sign In'}
    </Button>
  </form>;
}
