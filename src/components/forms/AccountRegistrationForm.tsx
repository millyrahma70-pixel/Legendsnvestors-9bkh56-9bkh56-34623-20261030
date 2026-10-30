import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import RegistrationBonus from '@/components/features/RegistrationBonus';
import RegistrationVerification from '@/components/features/RegistrationVerification';
import { registrationSchema, type RegistrationValues } from '@/lib/siteValidations';
import { usePublicSite } from '@/hooks/useSite';

export default function AccountRegistrationForm() {
  const [params] = useSearchParams();
  const publicSite = usePublicSite();
  const [details, setDetails] = useState<RegistrationValues | null>(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegistrationValues>({ 
    resolver: zodResolver(registrationSchema), 
    defaultValues: { name: '', phone: '', password: '', confirm: '', referral: params.get('ref') || '' } 
  });
  const referral = watch('referral');

  const wrap: any = { background: '#1e1e1e', border: '1px solid #333', borderRadius: '16px', padding: '14px 16px', display: 'flex', alignItems: 'center', marginTop: '6px' };
  const inp: any = { background: 'transparent', border: 'none', outline: 'none', color: 'white', width: '100%', fontSize: '16px' };
  const label: any = { color: '#aaa', fontSize: '13px', marginTop: '16px', display: 'block' };
  const err: any = { color: '#ff5555', fontSize: '12px', marginTop: '4px' };

  if (publicSite.isError) return <div style={{ background: '#141414', borderRadius: '24px', padding: '24px', color: 'white' }}><h2>Registration settings unavailable</h2><p>{publicSite.error.message}</p></div>;
  const closed = Boolean(publicSite.data?.settings.config.maintenance || publicSite.data?.settings.config.registrationOpen === false);
  const disabled = closed || publicSite.isPending;
  
  if (details) return (
    <div style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: '28px', padding: '24px' }}>
      <RegistrationVerification values={details} disabled={disabled} onBack={() => setDetails(null)} />
    </div>
  );

  return (
    <div>
      {publicSite.data && <div style={{ marginBottom: '16px' }}><RegistrationBonus amount={publicSite.data.settings.config.registrationBonus} /></div>}
      
      <form onSubmit={handleSubmit(values => setDetails(values))} style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: '28px', padding: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: 'white' }}>Create Account</h2>
        <p style={{ color: '#d4a017', fontSize: '13px', marginTop: '4px' }}>Step 1 of 2 · Account details</p>

        <label style={label}>Full Name</label>
        <div style={wrap}>👤 <input {...register('name')} placeholder="e.g. John Doe" disabled={disabled} style={{ ...inp, marginLeft: '10px' }} /></div>
        {errors.name && <p style={err}>{errors.name.message}</p>}

        <label style={label}>Phone Number</label>
        <div style={wrap}>📞 <input {...register('phone')} placeholder="e.g. 0751234567" disabled={disabled} style={{ ...inp, marginLeft: '10px' }} /></div>
        {errors.phone && <p style={err}>{errors.phone.message}</p>}

        <label style={label}>Password</label>
        <div style={wrap}>🔒 <input {...register('password')} type="password" placeholder="At least 6 characters" disabled={disabled} style={{ ...inp, marginLeft: '10px' }} /></div>
        {errors.password && <p style={err}>{errors.password.message}</p>}

        <label style={label}>Confirm Password</label>
        <div style={wrap}>🔒 <input {...register('confirm')} type="password" placeholder="Re-enter password" disabled={disabled} style={{ ...inp, marginLeft: '10px' }} /></div>
        {errors.confirm && <p style={err}>{errors.confirm.message}</p>}

        <label style={label}>Referral Code (Optional)</label>
        <div style={{ ...wrap, borderColor: referral ? '#f5c518' : '#333' }}>🎁 <input {...register('referral')} placeholder="Enter referral code if you have one" disabled={disabled} style={{ ...inp, marginLeft: '10px' }} /></div>
        {referral && !errors.referral && <p style={{ color: '#f5c518', fontSize: '13px', marginTop: '6px' }}>✓ Referral added: {referral}</p>}
        {errors.referral && <p style={err}>{errors.referral.message}</p>}

        <p style={{ color: '#888', fontSize: '12px', marginTop: '16px' }}>Next, verify your email to activate your account and receive the bonus.</p>

        <button type="submit" disabled={disabled} style={{ width: '100%', background: '#f5c518', color: 'black', fontWeight: 800, padding: '16px', borderRadius: '16px', border: 'none', fontSize: '18px', marginTop: '16px' }}>
          {publicSite.isPending ? 'Loading...' : 'Register & Claim Bonus'}
        </button>

        <p style={{ textAlign: 'center', color: '#888', fontSize: '14px', marginTop: '16px' }}>Already have an account? <Link to="/login" style={{ color: '#f5c518' }}>Sign In</Link></p>
      </form>
    </div>
  );
}
