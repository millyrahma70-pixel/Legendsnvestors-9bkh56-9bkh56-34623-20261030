import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AccountLoginForm({ onForgot }: { onForgot?: () => void }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const wrap: any = { background: '#1e1e1e', border: '1px solid #333', borderRadius: '16px', padding: '14px 16px', display: 'flex', alignItems: 'center', marginTop: '6px' };
  const inp: any = { background: 'transparent', border: 'none', outline: 'none', color: 'white', width: '100%', fontSize: '16px' };
  const label: any = { color: '#aaa', fontSize: '13px', marginTop: '16px', display: 'block' };

  const onLogin = () => {
    if (!phone.trim() || !password) return alert('Enter phone and password');
    try {
      const users = JSON.parse(localStorage.getItem('legend_users') || '[]');
      const user = users.find((u: any) => u.phone === phone.trim() && u.password === password);
      if (!user) return alert('Wrong phone or password! Please Register first.');
      localStorage.setItem('legend_current_user', JSON.stringify(user));
      window.location.href = window.location.origin + window.location.pathname + '#/dashboard';
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  return (
    <div style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: '28px', padding: '24px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: 'white' }}>Welcome Back</h2>
      <label style={label}>Phone Number</label>
      <div style={wrap}>📞 <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="0752568482" style={{ ...inp, marginLeft: '10px' }} /></div>
      <label style={label}>Password</label>
      <div style={wrap}>🔒 <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" style={{ ...inp, marginLeft: '10px' }} /></div>
      <button onClick={onLogin} style={{ width: '100%', background: '#f5c518', color: 'black', fontWeight: 800, padding: '16px', borderRadius: '16px', border: 'none', fontSize: '18px', marginTop: '20px' }}>Sign In</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
        <button type="button" onClick={onForgot} style={{ background: 'none', border: 'none', color: '#888', fontSize: '13px' }}>Forgot Password?</button>
        <Link to="/register" style={{ color: '#f5c518', fontSize: '13px' }}>Create Account</Link>
      </div>
    </div>
  );
}
