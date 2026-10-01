import React from 'react';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const SEATS_PER_ROW = 10;

const SeatMatrix = ({ bookedSeats = [], selectedSeats = [], onToggleSeat, ticketPrice = 200 }) => {
  return (
    <div style={{ padding: '24px 10px', textAlign: 'center' }}>
      {/* Curved Screen */}
      <div className="screen-wrapper">
        <div className="cinema-screen" />
        <p className="screen-text">All Eyes This Way &bull; Cinema Screen</p>
      </div>

      {/* Seat Rows Grid */}
      <div style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: '12px',
        margin: '20px auto 30px auto'
      }}>
        {ROWS.map((row) => (
          <div key={row} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Row Letter */}
            <span style={{
              width: '24px',
              fontSize: '0.8rem',
              fontWeight: '700',
              color: '#64748b',
              textAlign: 'left'
            }}>
              {row}
            </span>

            {/* Left Column (5 seats) */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {Array.from({ length: 5 }, (_, i) => {
                const seatId = `${row}${i + 1}`;
                const isBooked = bookedSeats.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);

                let seatClass = 'seat-item ';
                if (isBooked) seatClass += 'seat-booked';
                else if (isSelected) seatClass += 'seat-selected';
                else seatClass += 'seat-available';

                return (
                  <div
                    key={seatId}
                    className={seatClass}
                    onClick={() => !isBooked && onToggleSeat(seatId)}
                    title={isBooked ? `Seat ${seatId} (Sold Out)` : `Seat ${seatId} (₹${ticketPrice})`}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>

            {/* Walking Aisle Gap */}
            <div style={{ width: '28px' }} />

            {/* Right Column (5 seats) */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {Array.from({ length: 5 }, (_, i) => {
                const seatId = `${row}${i + 6}`;
                const isBooked = bookedSeats.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);

                let seatClass = 'seat-item ';
                if (isBooked) seatClass += 'seat-booked';
                else if (isSelected) seatClass += 'seat-selected';
                else seatClass += 'seat-available';

                return (
                  <div
                    key={seatId}
                    className={seatClass}
                    onClick={() => !isBooked && onToggleSeat(seatId)}
                    title={isBooked ? `Seat ${seatId} (Sold Out)` : `Seat ${seatId} (₹${ticketPrice})`}
                  >
                    {i + 6}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Seat Status Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        padding: '14px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'var(--seat-available)', border: '1px solid var(--seat-available-border)' }} />
          <span>Available</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'var(--seat-selected)', border: '1px solid #ff4d6d' }} />
          <span>Selected</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'var(--seat-booked)', opacity: 0.5 }} />
          <span>Sold Out</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMatrix;
