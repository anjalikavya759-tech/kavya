import React from 'react';
import { Film, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(7, 9, 14, 0.95)',
      padding: '40px 0 30px 0',
      marginTop: '60px'
    }}>
      <div className="max-w-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        textAlign: 'center'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Film size={22} color="#e11d48" />
          <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
            Cine<span style={{ color: '#e11d48' }}>Pass</span>
          </span>
        </div>

        <p style={{ color: '#64748b', fontSize: '0.88rem', maxWidth: '480px' }}>
          Your premier online destination for instant movie ticket bookings with interactive seat layouts and instant e-tickets.
        </p>

        <div style={{
          display: 'flex',
          gap: '20px',
          fontSize: '0.82rem',
          color: '#94a3b8'
        }}>
          <span>Privacy Policy</span>
          <span>&bull;</span>
          <span>Terms of Service</span>
          <span>&bull;</span>
          <span>Help & Support</span>
        </div>

        <p style={{ color: '#475569', fontSize: '0.78rem', marginTop: '10px' }}>
          &copy; {new Date().getFullYear()} CinePass Movie Ticketing System. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
