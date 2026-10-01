import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Calendar, MapPin, Ticket, ChevronLeft } from 'lucide-react';
import { api } from '../services/api.js';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  // Generate 3 consecutive days for date selector
  const dates = [0, 1, 2].map((offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return {
      iso: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      const movieData = await api.getMovieById(id);
      setMovie(movieData);

      const showsData = await api.getShows(id, selectedDate);
      setShows(showsData);
      setLoading(false);
    };

    loadDetails();
  }, [id, selectedDate]);

  if (loading || !movie) {
    return (
      <div className="max-w-container" style={{ padding: '80px 20px', textAlign: 'center', color: '#94a3b8' }}>
        Loading movie details...
      </div>
    );
  }

  // Group shows by theater
  const theatersMap = {};
  shows.forEach((show) => {
    if (!theatersMap[show.theater]) {
      theatersMap[show.theater] = {
        theater: show.theater,
        location: show.location || 'Hyderabad',
        shows: []
      };
    }
    theatersMap[show.theater].shows.push(show);
  });

  return (
    <div className="max-w-container" style={{ padding: '24px 20px 60px 20px' }}>
      {/* Back button */}
      <Link to="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        color: '#94a3b8',
        fontSize: '0.9rem',
        marginBottom: '20px'
      }}>
        <ChevronLeft size={18} /> Back to Movies
      </Link>

      {/* Movie Details Header Card */}
      <div className="glass-panel" style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '32px',
        padding: '32px',
        marginBottom: '40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Poster */}
        <div style={{
          width: '260px',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 15px 30px rgba(0,0,0,0.7)',
          flexShrink: 0
        }}>
          <img
            src={movie.poster}
            alt={movie.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span className="badge badge-crimson">{movie.language || 'Telugu'}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontSize: '0.9rem', fontWeight: '700' }}>
              <Star size={16} fill="#fbbf24" stroke="none" />
              <span>{movie.rating ? movie.rating.toFixed(1) : '8.5'} / 10</span>
            </div>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>
            {movie.title}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {movie.genre && movie.genre.map((g, i) => (
              <span key={i} style={{
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                color: '#cbd5e1'
              }}>
                {g}
              </span>
            ))}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 12px',
              color: '#94a3b8',
              fontSize: '0.8rem'
            }}>
              <Clock size={14} /> {movie.duration || 160} mins
            </span>
          </div>

          <p style={{ color: '#94a3b8', lineHeight: 1.7, marginBottom: '20px', fontSize: '0.95rem' }}>
            {movie.description}
          </p>

          {movie.director && (
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '6px' }}>
              <strong style={{ color: '#fff' }}>Director:</strong> {movie.director}
            </p>
          )}

          {movie.cast && movie.cast.length > 0 && (
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              <strong style={{ color: '#fff' }}>Starring:</strong> {movie.cast.join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Date Selector */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} color="#e11d48" /> Select Date
        </h2>

        <div style={{ display: 'flex', gap: '12px' }}>
          {dates.map((d) => {
            const isSelected = selectedDate === d.iso;
            return (
              <button
                key={d.iso}
                onClick={() => setSelectedDate(d.iso)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: isSelected ? '#e11d48' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid',
                  borderColor: isSelected ? '#e11d48' : 'rgba(255, 255, 255, 0.08)',
                  color: isSelected ? '#fff' : '#cbd5e1',
                  minWidth: '85px',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 0 15px rgba(225, 29, 72, 0.4)' : 'none'
                }}
              >
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.8 }}>{d.dayName}</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '800' }}>{d.dayNumber}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{d.month}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theaters & Showtimes */}
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
          Theaters & Showtimes
        </h2>

        {Object.keys(theatersMap).length === 0 ? (
          <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
            No shows scheduled for this date. Please select another date.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.values(theatersMap).map((item, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff' }}>
                      {item.theater}
                    </h3>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '0.82rem', marginTop: '2px' }}>
                      <MapPin size={13} /> {item.location}
                    </p>
                  </div>

                  <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                    M-TICKET AVAILABLE
                  </span>
                </div>

                {/* Showtimes Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {item.shows.map((show) => (
                    <Link
                      key={show._id}
                      to={`/booking/${show._id}`}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '10px 18px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#e11d48';
                        e.currentTarget.style.background = 'rgba(225, 29, 72, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      }}
                    >
                      <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#38bdf8' }}>
                        {show.showTime}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                        ₹{show.ticketPrice} &bull; {show.screen || 'Screen 1'}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
