import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { AdminAuthContext } from '@/lib/adminAuthContext';
import { getSupabaseClient } from '@/lib/api';
import { mapAdminUser } from '@/lib/adminAuth';
import { withRequestDeadline } from '@/lib/requestDeadline';
import type { AdminUser } from '@/types/admin';

interface Props { children: ReactNode }

export default function AdminAuthProvider({ children }: Props) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  useEffect(() => {
    let mounted = true;
    let unsubscribe = () => {};
    void withRequestDeadline(() => getSupabaseClient(), 12000).then(client => {
      if (!mounted) return;
      const { data } = client.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return;
        setUser(session?.user ? mapAdminUser(session.user) : null);
        if (_event === 'SIGNED_OUT') {
          queryClient.removeQueries({ queryKey: ['site'] });
          queryClient.removeQueries({ queryKey: ['admin-directory'] });
          queryClient.removeQueries({ queryKey: ['admin-access'] });
        }
        setLoading(false);
      });
      unsubscribe = () => data.subscription.unsubscribe();
      void withRequestDeadline(() => client.auth.getSession(), 12000).then(({ data: sessionData, error }) => {
        if (!mounted) return;
        if (error) toast.error('Unable to restore your session. Please sign in again.');
        setUser(sessionData.session?.user ? mapAdminUser(sessionData.session.user) : null);
        setLoading(false);
      }).catch(() => { if (mounted) { setLoading(false); toast.error('Session restoration timed out. Return to Sign In to reconnect.'); } });
    }).catch((error: Error) => { if (mounted) { setLoading(false); toast.error(error.message); } });
    return () => { mounted = false; unsubscribe(); };
  }, [queryClient]);
  const logout = useCallback(async () => {
    const client = await getSupabaseClient();
    const { error } = await client.auth.signOut();
    if (error) throw new Error('Unable to sign out. Please retry.');
    setUser(null);
    queryClient.removeQueries({ queryKey: ['site'] });
    queryClient.removeQueries({ queryKey: ['admin-directory'] });
    queryClient.removeQueries({ queryKey: ['admin-access'] });
  }, [queryClient]);
  const value = useMemo(() => ({ user, loading, logout }), [user, loading, logout]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
