import { useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { completeAccountRegistration, verifyAccountPassword } from '@/lib/siteAuth';
import type { RegistrationValues } from '@/lib/siteValidations';
export function useRegistrationVerification(email: string, values: RegistrationValues) {
  const verifiedEmail = useRef<string | null>(null);
  const requestKey = useRef(crypto.randomUUID());
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const save = useMutation({
    mutationFn: async (token: string) => {
      if (verifiedEmail.current !== email) {
        await verifyAccountPassword(email, token, values.password, values.name);
        verifiedEmail.current = email;
      }
      return completeAccountRegistration(values, requestKey.current);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['site'] });
      toast.success('Account created. Your name and phone number are saved.');
      navigate('/home', { replace: true });
    },
    onError: (error: Error) => toast.error(error.message),
    retry: false,
    gcTime: 0,
  });
  return { save, verified: Boolean(email) && verifiedEmail.current === email };
}
