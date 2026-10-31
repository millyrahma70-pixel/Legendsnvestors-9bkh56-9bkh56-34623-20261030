import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

export default function AccountRegistrationForm() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [referral, setReferral] = useState(params.get('ref') || '');

  const wrap: any = { background: '#1e1e1e', border: '1px solid #333', borderRadius: '16px', padding: '14px 16px', display: 'flex', alignItems: 'center', marginTop: '6px' };
  const inp: any = { background: 'transparent', border: 'none', outline: 'none', color: 'white', width: '100%', fontSize: '16px' };
  const label: any = { color: '#aaa', fontSize: '13px', marginTop: '16px', display: 'block' };

  const onRegister = () => {
    if (!name.trim()) { alert('Enter Full Name'); return; }
    if (!phone.trim() || phone.length < 9) { alert('Enter valid phone number'); return; }
    if (!password || password.length < 6) { alert('Password must be at least 6 characters'); return; }
    if (password !== confirm) { alert('Passwords do not match'); return; }

    setIsRegistering(true);
    
    // ALWAYS SUCCEED - NO VALIDATION LIBRARY, NO FETCH
    const users = JSON.parse(localStorage.getItem('legend_users') || '[]');
    if (users.find((u: any) => u.phone === phone)) {
      alert('Phone already registered! Go to Sign In.');
      navigate('/login');
      setIsRegistering(false);
      return;
    }

    const newUser = { name: name.trim(), phone: phone.trim(), password, referral, bonus: 9000, balance: 9000, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('legend_users', JSON.stringify(users));
    localStorage.setItem('legend_current_user', JSON.stringify(newUser));
    
    alert(`Success ${newUser.name}! UGX 9,000 credited.`);
    setIsRegistering(false);
    navigate('/login');
  };

  return (
    <div style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: '28px', padding: '24px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: 'white' }}>Create Account</h2>

      <label style={label}>Full Name</label>
      <div style={wrap}>👤 <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. John" style={{ ...inp, marginLeft: '10px' }} /></div>

      <label style={label}>Phone Number</label>
      <div style={wrap}>📞 <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="e.g. 07XXXXXXXXXX" style={{ ...inp, marginLeft: '10px' }} /></div>

      <label style={label}>Password</label>
      <div style={wrap}>🔒 <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="At least 6 characters" style={{ ...inp, marginLeft: '10px' }} /></div>

      <label style={label}>Confirm Password</label>
      <div style={wrap}>🔒 <input value={confirm} onChange={e=>setConfirm(e.target.value)} type="password" placeholder="Re-enter password" style={{ ...inp, marginLeft: '10px' }} /></div>

      <label style={label}>Referral Code (Optional)</label>
      <div style={wrap}>🎁 <input value={referral} onChange={e=>setReferral(e.target.value)} placeholder="Enter referral code" style={{ ...inp, marginLeft: '10px' }} /></div>

      <button onClick={onRegister} disabled={isRegistering} style={{ width: '100%', background: '#f5c518', color: 'black', fontWeight: 800, padding: '16px', borderRadius: '16px', border: 'none', fontSize: '18px', marginTop: '16px' }}>
        {isRegistering ? 'Creating...' : 'Register & Claim Bonus'}
      </button>

      <p style={{ textAlign: 'center', color: '#888', fontSize: '14px', marginTop: '16px' }}>Already have an account? <Link to="/login" style={{ color: '#f5c518' }}>Sign In</Link></p>
    </div>
  );
}
