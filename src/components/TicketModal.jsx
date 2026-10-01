import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Ticket, Calendar, Clock, MapPin, X, QrCode } from 'lucide-react';

const TicketModal = ({ booking, onClose }) => {
  const navigate = useNavigate();

  if (!booking) return null;

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '28px',
        position: 'relative',
        border: '1px solid rgba(225, 29, 72, 0.3)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 30px rgba(225, 29, 72, 0.2)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            color: '#94a3b8',
            padding: '4px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)'
          }}
        >
          <X size={20} />
        </button>

        {/* Success Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#10b981',
            marginBottom: '12px'
          }}>
            <CheckCircle2 size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f8fafc' }}>
            Booking Confirmed!
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
            Your e-ticket has been sent to your registered email
          </p>
        </div>

        {/* Printable Ticket Card */}
        <div style={{
          background: 'linear-gradient(145deg, #131926 0%, #0d121c 100%)',
          borderRadius: '16px',
          border: '1px dashed rgba(255, 255, 255, 0.15)',
          padding: '20px',
          marginBottom: '20px'
        }}>
          {/* Movie Title & Booking ID */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <span className="badge badge-crimson" style={{ marginBottom: '6px' }}>E-TICKET</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
                {booking.movie?.title || 'Selected Movie'}
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Booking ID</span>
              <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fbbf24', letterSpacing: '0.5px' }}>
                {booking.bookingId}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            padding: '14px 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.82rem'
          }}>
            <div>
              <p style={{ color: '#64748b' }}>Theater & Screen</p>
              <p style={{ fontWeight: '600', color: '#e2e8f0', marginTop: '2px' }}>
                {booking.show?.theater || 'PVR Cinemas'}
              </p>
            </div>

            <div>
              <p style={{ color: '#64748b' }}>Show Date & Time</p>
              <p style={{ fontWeight: '600', color: '#e2e8f0', marginTop: '2px' }}>
                {booking.show?.showDate || 'Today'} &bull; {booking.show?.showTime || '07:00 PM'}
              </p>
            </div>

            <div>
              <p style={{ color: '#64748b' }}>Seats ({booking.seats?.length})</p>
              <p style={{ fontWeight: '700', color: '#fb7185', marginTop: '2px' }}>
                {booking.seats ? booking.seats.join(', ') : 'N/A'}
              </p>
            </div>

            <div>
              <p style={{ color: '#64748b' }}>Total Paid</p>
              <p style={{ fontWeight: '800', color: '#10b981', marginTop: '2px' }}>
                ₹{booking.totalPrice}
              </p>
            </div>
          </div>

          {/* Barcode & QR Code simulation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '16px'
          }}>
            <div style={{
              letterSpacing: '5px',
              fontFamily: 'monospace',
              fontSize: '1.2rem',
              color: '#475569',
              userSelect: 'none'
            }}>
              ||| | |||| | ||||| | ||
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#94a3b8',
              fontSize: '0.75rem'
            }}>
              <QrCode size={20} color="#fbbf24" />
              <span>Scan at gate</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => window.print()}
            className="btn-secondary"
            style={{ flex: 1, padding: '10px' }}
          >
            Print Ticket
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/my-bookings');
            }}
            className="btn-primary"
            style={{ flex: 1, padding: '10px' }}
          >
            View Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
