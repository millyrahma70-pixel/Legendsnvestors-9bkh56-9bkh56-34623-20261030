import type { ReactNode } from 'react';

export default function SiteAuthLayout({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: 'white', padding: '20px', paddingBottom: '80px' }}>
      
      {/* TOP INFO TEXT - make it gold/grey on black, not white box */}
      <div style={{ maxWidth: '400px', margin: '0 auto', color: '#e0e0e0', fontSize: '14px', lineHeight: '1.6' }}>
        <p>Use your name or phone number to sign in. Members open their personal account; authorized administrators open their full-control panel.</p>
        
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ border: '1px solid white', borderRadius: '6px', padding: '2px 6px' }}>🛡️</span> Protected account access</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ border: '1px solid white', borderRadius: '6px', padding: '2px 6px' }}>📱</span> Your Cloud account on every device</div>
        </div>

        {/* BONUS CARD - GOLD BORDER */}
        <div style={{ marginTop: '20px', background: '#1c1a0f', border: '1px solid #3d3510', borderRadius: '20px', padding: '16px', display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#111', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🎁</div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '14px', color: 'white', margin: 0 }}>Registration Bonus</p>
            <p style={{ color: '#f5c518', fontWeight: 700, fontSize: '14px', margin: '4px 0 0 0' }}>UGX 9,000 credited on activation</p>
          </div>
        </div>
      </div>

      {/* YOUR LOGIN/REGISTER FORM */}
      <div style={{ maxWidth: '400px', margin: '24px auto 0 auto' }}>
        {children}
      </div>

      <p style={{ textAlign: 'center', color: '#888', fontSize: '14px', marginTop: '20px', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
        🎧 Need help? <span style={{ color: '#f5c518', textDecoration: 'underline' }}>Contact support</span>
      </p>
    </div>
  );
}
