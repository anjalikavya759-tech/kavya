import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Film, Calendar, Clock, MapPin, ShieldCheck, ChevronLeft } from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import SeatMatrix from '../components/SeatMatrix.jsx';
import TicketModal from '../components/TicketModal.jsx';

const BookingPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchShow = async () => {
      setLoading(true);
      const data = await api.getShowById(showId);
      setShow(data);
      setLoading(false);
    };
    fetchShow();
  }, [showId]);

  const handleToggleSeat = (seatId) => {
    setErrorMsg('');
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        setErrorMsg('You can select a maximum of 8 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBook = async () => {
    if (selectedSeats.length === 0) {
      setErrorMsg('Please select at least one seat to proceed.');
      return;
    }

    if (!user) {
      // Redirect to auth page or allow demo booking
      navigate('/auth', { state: { returnTo: `/booking/${showId}` } });
      return;
    }

    setBookingLoading(true);
    setErrorMsg('');

    try {
      const res = await api.bookTickets({
        showId,
        seats: selectedSeats,
        paymentMethod
      });

      if (res.success) {
        // Construct full ticket object
        const fullTicket = {
          ...res.data,
          movie: show.movie,
          show: {
            theater: show.theater,
            screen: show.screen,
            showDate: show.showDate,
            showTime: show.showTime,
            ticketPrice: show.ticketPrice
          },
          seats: selectedSeats,
          totalPrice: selectedSeats.length * show.ticketPrice + 30
        };

        // Cache for demo
        const prev = JSON.parse(localStorage.getItem('demo_bookings') || '[]');
        localStorage.setItem('demo_bookings', JSON.stringify([fullTicket, ...prev]));

        setConfirmedBooking(fullTicket);
      } else {
        setErrorMsg(res.message || 'Booking failed');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong while booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading || !show) {
    return (
      <div className="max-w-container" style={{ padding: '80px 20px', textAlign: 'center', color: '#94a3b8' }}>
        Loading seat layout...
      </div>
    );
  }

  const ticketPrice = show.ticketPrice || 250;
  const subtotal = selectedSeats.length * ticketPrice;
  const convenienceFee = selectedSeats.length > 0 ? 30 : 0;
  const totalPayable = subtotal + convenienceFee;

  return (
    <div className="max-w-container" style={{ padding: '24px 20px 60px 20px' }}>
      {/* Top Breadcrumb */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: '#94a3b8',
          fontSize: '0.9rem',
          marginBottom: '20px'
        }}
      >
        <ChevronLeft size={18} /> Change Movie / Showtime
      </button>

      {/* Show Information Bar */}
      <div className="glass-panel" style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 28px',
        marginBottom: '32px',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>
            {show.movie?.title}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={14} color="#e11d48" /> {show.theater} ({show.screen || 'Screen 1'})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={14} color="#fbbf24" /> {show.showDate}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={14} color="#38bdf8" /> {show.showTime}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Price per ticket</span>
          <p style={{ fontSize: '1.3rem', fontWeight: '800', color: '#10b981' }}>₹{ticketPrice}</p>
        </div>
      </div>

      {/* Main Booking Area: Grid of Seats & Checkout Sidebar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 340px',
        gap: '30px',
        alignItems: 'start'
      }}>
        {/* Seat Layout */}
        <div className="glass-panel" style={{ padding: '24px 10px', overflowX: 'auto' }}>
          <SeatMatrix
            bookedSeats={show.bookedSeats || []}
            selectedSeats={selectedSeats}
            onToggleSeat={handleToggleSeat}
            ticketPrice={ticketPrice}
          />
        </div>

        {/* Order Summary & Payment Box */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', color: '#fff' }}>
            Booking Summary
          </h3>

          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              marginBottom: '16px'
            }}>
              {errorMsg}
            </div>
          )}

          {/* Selected Seats List */}
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Selected Seats ({selectedSeats.length}):</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {selectedSeats.length === 0 ? (
                <span style={{ color: '#64748b', fontSize: '0.85rem', fontStyle: 'italic' }}>
                  No seats chosen yet
                </span>
              ) : (
                selectedSeats.map((seat) => (
                  <span key={seat} style={{
                    background: '#e11d48',
                    color: '#fff',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: '700'
                  }}>
                    {seat}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Price Breakdown */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '14px 0',
            marginBottom: '20px',
            fontSize: '0.88rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#cbd5e1' }}>
              <span>Tickets ({selectedSeats.length} × ₹{ticketPrice})</span>
              <span>₹{subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#cbd5e1' }}>
              <span>Convenience Fee & GST</span>
              <span>₹{convenienceFee}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: '800',
              fontSize: '1.1rem',
              color: '#fff',
              marginTop: '12px',
              paddingTop: '8px',
              borderTop: '1px dashed rgba(255, 255, 255, 0.1)'
            }}>
              <span>Total Amount</span>
              <span style={{ color: '#10b981' }}>₹{totalPayable}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '8px' }}>
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
              <option value="Credit/Debit Card">Credit / Debit Card</option>
              <option value="Net Banking">Net Banking</option>
            </select>
          </div>

          {/* Book Now Button */}
          <button
            onClick={handleBook}
            disabled={bookingLoading || selectedSeats.length === 0}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              opacity: selectedSeats.length === 0 ? 0.5 : 1,
              cursor: selectedSeats.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {bookingLoading ? 'Processing Booking...' : `Pay ₹${totalPayable} & Confirm`}
          </button>

          <p style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: '#64748b',
            fontSize: '0.75rem',
            marginTop: '14px'
          }}>
            <ShieldCheck size={14} color="#10b981" /> 256-bit Secure Encryption
          </p>
        </div>
      </div>

      {/* Ticket Modal Confirmation */}
      {confirmedBooking && (
        <TicketModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
        />
      )}
    </div>
  );
};

export default BookingPage;
