import { getSupabaseClient } from '@/lib/api';
import { siteCommand } from '@/lib/siteApi';
import { ADMIN_EMAIL } from '@/constants/admin';
import { signInWithIdentity } from '@/lib/sharedLogin';

export async function sendAccountOtp(email:string,create=false) {
  if (email.toLowerCase()===ADMIN_EMAIL) throw new Error('For the administrator account, use Recover administrator access on the shared sign-in page.');
  const client=await getSupabaseClient();
  const {error}=await client.auth.signInWithOtp({email,options:{shouldCreateUser:create}});
  if (error) throw new Error(error.message);
}
export async function verifyAccountPassword(email:string,token:string,password:string,name?:string) {
  const client=await getSupabaseClient();
  const {error}=await client.auth.verifyOtp({email,token,type:'email'});
  if (error) throw new Error('Invalid or expired email code. Request a new code');
  const profileName=name?.trim();
  const result=await client.auth.updateUser({password,data:{legend_password_setup:true,...(profileName?{username:profileName,full_name:profileName}:{})}});
  if (result.error) throw new Error(result.error.message);
}
export async function registerAccount(values:{email:string;token:string;password:string;phone:string;referral:string;name?:string}) {
  await verifyAccountPassword(values.email,values.token,values.password,values.name);
  return completeAccountRegistration(values,crypto.randomUUID());
}
export async function completeAccountRegistration(values:{phone:string;referral:string},requestKey:string) {
  return siteCommand({action:'enroll',payload:{phone:values.phone,referral:values.referral},requestKey});
}
export async function signInAccount(identifier:string,password:string) {
  return signInWithIdentity(identifier,password);
}
