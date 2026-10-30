import { useCallback, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useIncomeNotifications } from '@/hooks/useIncomeNotifications';
import { fetchPublicSite, siteCommand } from '@/lib/siteApi';
import type { SiteCommand, SiteFilter } from '@/types/site';
import type { RunSiteAction } from '@/types/siteActions';

export function usePublicSite() {
  return useQuery({queryKey:['site-public'],queryFn:fetchPublicSite,staleTime:10000,refetchInterval:15000,retry:1});
}
export function useSite(filter:SiteFilter={}) {
  const {user,loading}=useAdminAuth();
  const client=useQueryClient();
  const pendingKeys=useRef(new Map<string,string>());
  const query=useQuery({queryKey:['site',user?.id,filter],queryFn:({signal})=>siteCommand({action:'snapshot',payload:{}},filter,signal),enabled:!loading && Boolean(user?.verified),refetchInterval:state=>state.state.error?false:15000,refetchOnWindowFocus:false,staleTime:10000,retry:false});
  useEffect(()=>{if(query.error) toast.error(query.error.message,{id:'site-error'});},[query.error]);
  useIncomeNotifications(query.data);
  const mutation=useMutation({
    mutationFn:(command:SiteCommand)=>{
      const fingerprint=JSON.stringify(command);
      const requestKey=command.requestKey??pendingKeys.current.get(fingerprint)??crypto.randomUUID();
      pendingKeys.current.set(fingerprint,requestKey);
      return siteCommand({...command,requestKey},filter);
    },
    onSuccess:(data,command)=>{pendingKeys.current.delete(JSON.stringify(command));client.setQueryData(['site',user?.id,filter],data);void client.invalidateQueries({queryKey:['site']});void client.invalidateQueries({queryKey:['site-public']});toast.success(command.action==='resetOtp'?'Password reset verification sent to the account owner':command.action==='incomeRun'?'Due daily income settled in Cloud. Check the activity ledger for this run.':'Change saved in Cloud');},
    onError:(error:Error)=>toast.error(error.message),
    retry:false,
  });
  const run:RunSiteAction=useCallback((action,payload={})=>mutation.mutateAsync({action,payload}),[mutation.mutateAsync]);
  return {...query,command:mutation,run,session:user,sessionLoading:loading};
}
