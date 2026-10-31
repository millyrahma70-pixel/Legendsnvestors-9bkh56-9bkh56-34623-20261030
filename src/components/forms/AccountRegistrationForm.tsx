import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import RegistrationBonus from '@/components/features/RegistrationBonus';
import { registrationSchema, type RegistrationValues } from '@/lib/siteValidations';
import { usePublicSite } from '@/hooks/useSite';

export default function AccountRegistrationForm() {
  const [params] = useSearchParams();
  const publicSite = usePublicSite();
  const [isRegistering, setIsRegistering] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegistrationValues>({ 
    resolver: zodResolver(registrationSchema), 
    defaultValues: { name: '', phone: '', password: '', confirm: '', referral: params.get('ref') || '' } 
  });
  const referral = watch('referral');

  const wrap: any = { background: '#1e1e1e', border: '1px solid #333', borderRadius: '16px', padding: '14px 16px', display: 'flex', alignItems: 'center', marginTop: '6px' };
  const inp: any = { background: 'transparent', border: 'none', outline: 'none', color: 'white', width: '100%', fontSize: '16px' };
  const label: any = { color: '#aaa', fontSize: '13px', marginTop: '16px', display: 'block' };
  const err: any = { color: '#ff5555', fontSize: '12px', marginTop: '4px' };

  const bonusAmount = publicSite.data?.settings.config.registrationBonus || 9000;

  const onSubmit = (values: RegistrationValues) => {
    setIsRegistering(true);
    try {
      // SAVE TO GITHUB PAGES STORAGE - NO SERVER NEEDED
      const users = JSON.parse(localStorage.getItem('legend_users') || '[]');
      
      // Check if phone already exists
      if (users.find((u: any) => u.phone === values.phone)) {
        alert('Phone already registered! Please Sign In.');
        window.location.href = '/login';
        return;
      }

      users.push({ 
        name: values.name, 
        phone: values.phone, 
        password: values.password, 
        referral: values.referral,
        bonus: bonusAmount, 
        balance: bonusAmount,
        createdAt: new Date().toISOString() 
      });
      localStorage.setItem('legend_users', JSON.stringify(users));
      localStorage.setItem('legend_current_user', JSON.stringify({ name: values.name, phone: values.phone }));
      
      alert(`Success! ${values.name}, account created! UGX ${bonusAmount} bonus credited.`);
      window.location.href = '/login';
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <RegistrationBonus amount={bonusAmount} />
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: '28px', padding: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: 'white' }}>Create Account</h2>
        <p style={{ color: '#d4a017', fontSize: '13px', marginTop: '4px' }}>GitHub Only • Instant activation</p>

        <label style={label}>Full Name</label>
        <div style={wrap}>👤 <input {...register('name')} placeholder="e.g. Milly" style={{ ...inp, marginLeft: '10px' }} /></div>
        {errors.name && <p style={err}>{errors.name.message}</p>}

        <label style={label}>Phone Number</label>
        <div style={wrap}>📞 <input {...register('phone')} placeholder="e.g. 0752568482" style={{ ...inp, marginLeft: '10px' }} /></div>
        {errors.phone && <p style={err}>{errors.phone.message}</p>}

        <label style={label}>Password</label>
        <div style={wrap}>🔒 <input {...register('password')} type="password" placeholder="At least 6 characters" style={{ ...inp, marginLeft: '10px' }} /></div>
        {errors.password && <p style={err}>{errors.password.message}</p>}

        <label style={label}>Confirm Password</label>
        <div style={wrap}>🔒 <input {...register('confirm')} type="password" placeholder="Re-enter password" style={{ ...inp, marginLeft: '10px' }} /></div>
        {errors.confirm && <p style={err}>{errors.confirm.message}</p>}

        <label style={label}>Referral Code (Optional)</label>
        <div style={{ ...wrap, borderColor: referral ? '#f5c518' : '#333' }}>🎁 <input {...register('referral')} placeholder="Enter referral code" style={{ ...inp, marginLeft: '10px' }} /></div>

        <button type="submit" disabled={isRegistering} style={{ width: '100%', background: '#f5c518', color: 'black', fontWeight: 800, padding: '16px', borderRadius: '16px', border: 'none', fontSize: '18px', marginTop: '16px' }}>
          {isRegistering ? 'Creating...' : 'Register & Claim Bonus'}
        </button>

        <p style={{ textAlign: 'center', color: '#888', fontSize: '14px', marginTop: '16px' }}>Already have an account? <Link to="/login" style={{ color: '#f5c518' }}>Sign In</Link></p>
      </form>
    </div>
  );
          }
