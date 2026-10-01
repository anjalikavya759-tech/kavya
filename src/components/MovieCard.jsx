import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket } from 'lucide-react';

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <Link to={`/movie/${movie._id}`}>
        <div className="movie-poster-wrap">
          <img
            src={movie.poster}
            alt={movie.title}
            className="movie-poster-img"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500';
            }}
          />

          {/* Top Rating Badge */}
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(15, 20, 30, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            padding: '4px 10px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            color: '#fbbf24',
            fontSize: '0.82rem',
            fontWeight: '700'
          }}>
            <Star size={14} fill="#fbbf24" stroke="none" />
            <span>{movie.rating ? movie.rating.toFixed(1) : '8.5'}</span>
          </div>

          {/* Bottom language pill */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'rgba(225, 29, 72, 0.85)',
            backdropFilter: 'blur(6px)',
            padding: '3px 9px',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            color: '#fff'
          }}>
            {movie.language || 'Telugu'}
          </div>
        </div>
      </Link>

      <div style={{ padding: '16px' }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '700',
          marginBottom: '8px',
          color: '#f8fafc',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {movie.title}
        </h3>

        {/* Genres */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          marginBottom: '12px'
        }}>
          {movie.genre && movie.genre.slice(0, 2).map((g, i) => (
            <span key={i} style={{
              fontSize: '0.72rem',
              color: '#94a3b8',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              {g}
            </span>
          ))}
        </div>

        {/* Meta info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '0.8rem' }}>
            <Clock size={14} />
            <span>{movie.duration || 160} mins</span>
          </div>

          <Link
            to={`/movie/${movie._id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#fb7185',
              fontSize: '0.85rem',
              fontWeight: '700'
            }}
          >
            <Ticket size={15} />
            Book
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
