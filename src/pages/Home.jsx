import React, { useState, useEffect } from 'react';
import { Search, Flame, Sparkles } from 'lucide-react';
import { api } from '../services/api.js';
import MovieCard from '../components/MovieCard.jsx';
import { Link } from 'react-router-dom';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Drama', 'Thriller', 'Crime'];

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, [search, selectedGenre]);

  const fetchMovies = async () => {
    setLoading(true);
    const genreFilter = selectedGenre === 'All' ? '' : selectedGenre;
    const data = await api.getMovies(search, genreFilter);
    setMovies(data);
    setLoading(false);
  };

  const featured = movies[0];

  return (
    <div className="max-w-container" style={{ paddingBottom: '40px' }}>
      {/* Hero Banner Section */}
      {featured && (
        <div style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          margin: '24px 0 40px 0',
          minHeight: '420px',
          display: 'flex',
          alignItems: 'flex-end',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)'
        }}>
          {/* Background Image with Gradient Overlay */}
          <img
            src={featured.banner || featured.poster}
            alt={featured.title}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.65)'
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, #07090e 10%, rgba(7, 9, 14, 0.6) 50%, transparent 100%)'
          }} />

          {/* Hero Content */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            padding: '40px',
            maxWidth: '680px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span className="badge badge-crimson">
                <Flame size={14} /> FEATURED BLOCKBUSTER
              </span>
              <span className="badge badge-gold">
                ★ {featured.rating || '8.8'} / 10
              </span>
            </div>

            <h1 style={{
              fontSize: '2.8rem',
              fontWeight: '800',
              lineHeight: 1.15,
              color: '#fff',
              marginBottom: '14px',
              letterSpacing: '-0.5px'
            }}>
              {featured.title}
            </h1>

            <p style={{
              color: '#cbd5e1',
              fontSize: '1rem',
              lineHeight: 1.6,
              marginBottom: '24px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {featured.description}
            </p>

            <div style={{ display: 'flex', gap: '14px' }}>
              <Link to={`/movie/${featured._id}`} className="btn-primary" style={{ padding: '14px 28px' }}>
                <Sparkles size={18} /> Book Now
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Genre Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                background: selectedGenre === genre ? '#e11d48' : 'rgba(255, 255, 255, 0.05)',
                color: selectedGenre === genre ? '#fff' : '#94a3b8',
                border: '1px solid',
                borderColor: selectedGenre === genre ? '#e11d48' : 'rgba(255, 255, 255, 0.08)',
                transition: 'all 0.2s',
                boxShadow: selectedGenre === genre ? '0 0 15px rgba(225, 29, 72, 0.4)' : 'none'
              }}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '40px' }}
          />
        </div>
      </div>

      {/* Movies Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '24px'
      }}>
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>

      {!loading && movies.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>No movies found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
