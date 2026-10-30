import { getSupabaseClient } from '@/lib/api';
export async function changeAccountPassword(email:string,oldPassword:string,newPassword:string) {
  const client=await getSupabaseClient();
  const {error:loginError}=await client.auth.signInWithPassword({email,password:oldPassword});
  if(loginError)throw new Error('Your current password is incorrect');
  const {error}=await client.auth.updateUser({password:newPassword});
  if(error)throw new Error(error.message);
}
