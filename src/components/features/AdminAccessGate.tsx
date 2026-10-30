import { useEffect, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { checkAdminAccess, isAuthorizedAdmin } from '@/lib/adminAuth';

interface Props { children: ReactNode }

export default function AdminAccessGate({ children }: Props) {
  const { user, loading } = useAdminAuth();
  const access = useQuery({ queryKey: ['admin-access', user?.id], queryFn: checkAdminAccess, enabled: !loading && isAuthorizedAdmin(user), retry: 1, staleTime: 60000 });
  useEffect(() => { if (access.error) toast.error(access.error.message); }, [access.error]);
  if (loading) return <div role="status" className="min-h-screen grid place-items-center bg-background text-foreground">Restoring admin session...</div>;
  if (!isAuthorizedAdmin(user)) return <Navigate to="/login" replace />;
  if (access.isPending) return <div role="status" className="min-h-screen grid place-items-center bg-background text-foreground">Verifying administrator...</div>;
  if (access.isError || !access.data) return (
    <main className="min-h-screen grid place-items-center p-6 bg-background"><section className="max-w-lg rounded-2xl border border-border bg-card p-8 space-y-4">
      <ShieldAlert className="text-primary" /><h1 className="text-2xl font-semibold">Admin access could not be verified</h1>
      <p className="text-muted-foreground">Sign in with your admin number and password, or retry your connection.</p>
      <Button onClick={() => void access.refetch()} disabled={access.isFetching}>Retry verification</Button>
    </section></main>
  );
  return <>{children}</>;
}
