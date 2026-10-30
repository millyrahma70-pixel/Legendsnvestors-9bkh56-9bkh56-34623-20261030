import { useState } from 'react';
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useSite } from '@/hooks/useSite';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { isAuthorizedAdmin } from '@/lib/adminAuth';
import SiteUserLayout from '@/components/layout/SiteUserLayout';
import SiteUserContent from '@/components/features/SiteUserContent';
import SiteAccountSetupForm from '@/components/forms/SiteAccountSetupForm';
import SiteAccountConnectionState from '@/components/features/SiteAccountConnectionState';
export default function CloudUserPage() {
  const {pathname}=useLocation();
  const [params]=useSearchParams();
  const navigate=useNavigate();
  const {logout}=useAdminAuth();
  const [logoutBusy,setLogoutBusy]=useState(false);
  const query=useSite({orderPage:Math.max(0,Number(params.get('orderPage'))||0)});
  if(query.sessionLoading)return <main role="status" className="min-h-screen grid place-items-center">Restoring verified account...</main>;
  if(!query.session)return <Navigate to="/login" replace/>;
  if(isAuthorizedAdmin(query.session))return <Navigate to="/admin" replace/>;
  if(!query.session.verified)return <SiteAccountConnectionState error="Email verification is incomplete. Complete registration or use account recovery from Sign In."/>;
  const data=query.data;
  if(!data)return <SiteAccountConnectionState error={query.error?.message} loading={query.isPending||query.isFetching} onRetry={()=>void query.refetch()}/>;
  const busy=query.command.isPending||query.isError||data.settings.config.maintenance||data.account?.status==='suspended';
  const signOut=()=>{setLogoutBusy(true);void logout().then(()=>navigate('/login',{replace:true})).catch((e:Error)=>{toast.error(e.message);setLogoutBusy(false);});};
  return <SiteUserLayout siteName={data.settings.config.siteName} onLogout={signOut} logoutBusy={logoutBusy}>{query.isError&&<section role="alert" className="mb-6 space-y-3 rounded-xl border border-primary/30 bg-card p-4"><p className="font-semibold">Showing previously loaded records · wallet actions paused</p><p className="text-muted-foreground">{query.error.message}</p><div className="flex flex-wrap gap-4"><Button variant="outline" className="min-h-11 rounded-xl" disabled={query.isFetching} onClick={()=>void query.refetch()}>{query.isFetching?'Reconnecting…':'Retry connection'}</Button><Button variant="ghost" className="min-h-11 rounded-xl text-primary" onClick={()=>navigate('/login')}>Return to Sign In</Button></div></section>}{(data.settings.config.maintenance||data.account?.status==='suspended')&&<div role="alert" className="mb-6 rounded-xl border border-primary/30 bg-primary/10 p-4"><p className="font-semibold">{data.account?.status==='suspended'?'Account access is suspended':'Website maintenance in progress'}</p><p className="mt-2 text-muted-foreground">Member actions are paused. Your records remain saved; contact support for assistance.</p></div>}{data.account?<SiteUserContent data={data} path={pathname} run={query.run} busy={busy}/>:<SiteAccountSetupForm run={query.run} busy={busy}/>}</SiteUserLayout>;
}
