import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { isAuthorizedAdmin } from '@/lib/adminAuth';
import { fetchJoiningRecords } from '@/lib/registrationDirectory';

export function useAdminRegistrations(search = '', page = 0) {
  const { user } = useAdminAuth();
  const query = useQuery({
    queryKey: ['admin-directory', user?.id, search, page],
    queryFn: () => fetchJoiningRecords(search, page),
    enabled: isAuthorizedAdmin(user),
    refetchInterval: 15000,
    staleTime: 10000,
    retry: 1,
  });
  useEffect(() => { if (query.error) toast.error(query.error.message, { id: 'admin-directory-error' }); }, [query.error]);
  return query;
}
