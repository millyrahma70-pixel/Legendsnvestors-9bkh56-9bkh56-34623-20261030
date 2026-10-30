import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { isAuthorizedAdmin } from '@/lib/adminAuth';
export default function Index() {
  const {user,loading}=useAdminAuth();
  if(loading)return <main role="status" className="min-h-screen grid place-items-center bg-background"><p className="font-semibold text-primary text-xl">Connecting to Legend Investors...</p></main>;
  return <Navigate to={isAuthorizedAdmin(user)?'/admin':user?.verified?'/home':'/login'} replace/>;
}
