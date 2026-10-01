import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import TicketModal from '../components/TicketModal.jsx';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const data = await api.getMyBookings();
    setBookings(data);
    setLoading(false);
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const updated = bookings.map((b) =>
        b.bookingId === bookingId ? { ...b, bookingStatus: 'cancelled' } : b
      );
      setBookings(updated);
      localStorage.setItem('demo_bookings', JSON.stringify(updated));
    }
  };

  return (
    <div className="max-w-container" style={{ padding: '32px 20px 60px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff' }}>
            My Tickets
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage and view your active and past movie bookings
          </p>
        </div>

        <Link to="/" className="btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
          Explore Movies <ArrowRight size={16} />
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
          Loading your tickets...
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(225, 29, 72, 0.1)',
            color: '#e11d48',
            marginBottom: '16px'
          }}>
            <Ticket size={32} />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
            No Bookings Found
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px auto' }}>
            You haven't booked any movie tickets yet. Pick a movie and secure your favorite seats!
          </p>
          <Link to="/" className="btn-primary">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {bookings.map((b) => {
            const isCancelled = b.bookingStatus === 'cancelled';
            return (
              <div
                key={b.bookingId || b._id}
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '24px',
                  gap: '20px',
                  borderLeft: `4px solid ${isCancelled ? '#64748b' : '#e11d48'}`,
                  opacity: isCancelled ? 0.7 : 1
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#fbbf24', letterSpacing: '0.5px' }}>
                      {b.bookingId}
                    </span>
                    <span
                      className={`badge ${isCancelled ? '' : 'badge-crimson'}`}
                      style={{
                        background: isCancelled ? 'rgba(100, 116, 139, 0.2)' : undefined,
                        color: isCancelled ? '#94a3b8' : undefined,
                        border: isCancelled ? '1px solid #475569' : undefined
                      }}
                    >
                      {isCancelled ? 'CANCELLED' : 'CONFIRMED'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff' }}>
                    {b.movie?.title || 'Blockbuster Movie'}
                  </h3>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} color="#e11d48" /> {b.show?.theater || 'Cinema Hall'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} color="#fbbf24" /> {b.show?.showDate || 'Today'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} color="#38bdf8" /> {b.show?.showTime || '07:00 PM'}
                    </span>
                  </div>

                  <div style={{ marginTop: '10px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Seats: </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fb7185' }}>
                      {b.seats ? b.seats.join(', ') : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Right price & action */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Amount Paid</span>
                    <p style={{ fontSize: '1.3rem', fontWeight: '800', color: '#10b981' }}>₹{b.totalPrice}</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={() => setSelectedTicket(b)}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    >
                      View Ticket
                    </button>

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelBooking(b.bookingId)}
                        style={{
                          background: 'none',
                          color: '#ef4444',
                          fontSize: '0.78rem',
                          fontWeight: '600',
                          padding: '4px'
                        }}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedTicket && (
        <TicketModal
          booking={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};

export default MyBookings;
