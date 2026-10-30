import type { ReactNode } from 'react';

export default function SiteAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: 'white', padding: '20px' }}>
      
      {/* TOP HEADER - LIKE VERCEL */}
      <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#e6b800', margin: 0 }}>≡ LEGEND</h1>
        <p style={{ color: '#e6b800', fontWeight: 700, letterSpacing: '2px', fontSize: '16px', margin: '4px 0' }}>INVESTORS PLATFORM</p>
        <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>Uganda's Premium Investment Community</p>
      </div>

      {/* BONUS CARD */}
      <div style={{ maxWidth: '400px', margin: '20px auto', background: '#1c1a0f', border: '1px solid #c9a227', borderRadius: '16px', padding: '14px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ width: '48px', height: '48px', background: '#f5c518', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🎁</div>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>Registration Bonus</p>
          <p style={{ margin: 0, color: '#f5c518', fontWeight: 700, fontSize: '13px' }}>UGX 9,000 credited on activation</p>
        </div>
      </div>

      {/* YOUR LOGIN FORM */}
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        {children}
      </div>

      {/* BOTTOM 3 BOXES - LIKE VERCEL */}
      <div style={{ maxWidth: '400px', margin: '20px auto', display: 'flex', gap: '8px' }}>
        <div style={{ flex: 1, background: '#111', borderRadius: '12px', padding: '12px', textAlign: 'center', border: '1px solid #222' }}>
          <p style={{ color: '#e6b800', fontWeight: 800, margin: 0, fontSize: '13px' }}>UGX 9,000</p>
          <p style={{ color: '#666', fontSize: '10px', marginTop: '4px' }}>Registration Bonus</p>
        </div>
        <div style={{ flex: 1, background: '#111', borderRadius: '12px', padding: '12px', textAlign: 'center', border: '1px solid #222' }}>
          <p style={{ color: '#e6b800', fontWeight: 800, margin: 0, fontSize: '13px' }}>27%-45%</p>
          <p style={{ color: '#666', fontSize: '10px', marginTop: '4px' }}>Daily Return</p>
        </div>
        <div style={{ flex: 1, background: '#111', borderRadius: '12px', padding: '12px', textAlign: 'center', border: '1px solid #222' }}>
          <p style={{ color: '#e6b800', fontWeight: 800, margin: 0, fontSize: '13px' }}>UGX 300</p>
          <p style={{ color: '#666', fontSize: '10px', marginTop: '4px' }}>Daily Check-in</p>
        </div>
      </div>
    </div>
  );
}
