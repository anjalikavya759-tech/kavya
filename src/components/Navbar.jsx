import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Ticket, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      background: 'rgba(7, 9, 14, 0.85)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div className="max-w-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(225, 29, 72, 0.4)'
          }}>
            <Film size={22} color="#fff" />
          </div>
          <span style={{
            fontSize: '1.4rem',
            fontWeight: '800',
            letterSpacing: '-0.5px',
            background: 'linear-gradient(to right, #fff, #cbd5e1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Cine<span style={{ color: '#e11d48', WebkitTextFillColor: '#e11d48' }}>Pass</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link to="/" style={{
            fontSize: '0.95rem',
            fontWeight: '600',
            color: '#cbd5e1',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = '#e11d48'}
          onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
          >
            Movies
          </Link>

          <Link to="/my-bookings" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.95rem',
            fontWeight: '600',
            color: '#cbd5e1',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = '#e11d48'}
          onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
          >
            <Ticket size={18} />
            My Tickets
          </Link>
        </div>

        {/* User Auth Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '8px 14px',
                borderRadius: '30px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <UserIcon size={16} color="#fb7185" />
                <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#f1f5f9' }}>
                  {user.name}
                </span>
              </div>
              <button
                onClick={() => { logout(); navigate('/'); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
