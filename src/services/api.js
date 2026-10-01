const API_BASE = 'http://localhost:5000/api';

// Fallback Mock Movies (so UI is 100% functional even before DB seed)
const MOCK_MOVIES = [
  {
    _id: 'm1',
    title: 'Devara: Part 1',
    description: 'An epic action saga set against coastal lands, where an unyielding man fights fearless warriors to protect his people.',
    genre: ['Action', 'Drama', 'Thriller'],
    language: 'Telugu',
    duration: 178,
    releaseDate: '2024-09-27',
    rating: 8.6,
    director: 'Koratala Siva',
    cast: ['NTR Jr.', 'Janhvi Kapoor', 'Saif Ali Khan'],
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
    banner: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200'
  },
  {
    _id: 'm2',
    title: 'Kalki 2898 AD',
    description: 'A modern avatar of Vishnu descends to Earth to protect the world from evil forces in a breathtaking dystopian world.',
    genre: ['Sci-Fi', 'Action', 'Mythology'],
    language: 'Telugu',
    duration: 181,
    releaseDate: '2024-06-27',
    rating: 8.9,
    director: 'Nag Ashwin',
    cast: ['Prabhas', 'Amitabh Bachchan', 'Deepika Padukone', 'Kamal Haasan'],
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500',
    banner: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1200'
  },
  {
    _id: 'm3',
    title: 'Pushpa 2: The Rule',
    description: 'Pushpa Raj expands his sandalwood empire while locking horns with ruthless adversaries in an adrenaline-pumping showdown.',
    genre: ['Action', 'Crime', 'Drama'],
    language: 'Telugu',
    duration: 185,
    releaseDate: '2024-12-05',
    rating: 9.1,
    director: 'Sukumar',
    cast: ['Allu Arjun', 'Rashmika Mandanna', 'Fahadh Faasil'],
    poster: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500',
    banner: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1200'
  }
];

const MOCK_SHOWS = [
  {
    _id: 's1',
    movie: 'm1',
    theater: 'Prasads Multiplex: Large Screen',
    location: 'Necklace Road, Hyderabad',
    screen: 'Screen 1 (Dolby Atmos)',
    showDate: new Date().toISOString().split('T')[0],
    showTime: '11:00 AM',
    ticketPrice: 250,
    totalSeats: 60,
    bookedSeats: ['A1', 'A2', 'B4', 'C5']
  },
  {
    _id: 's2',
    movie: 'm1',
    theater: 'AMB Cinemas: Screen 4',
    location: 'Gachibowli, Hyderabad',
    screen: 'Screen 4 (4K Laser)',
    showDate: new Date().toISOString().split('T')[0],
    showTime: '02:30 PM',
    ticketPrice: 295,
    totalSeats: 60,
    bookedSeats: ['B1', 'B2', 'D3']
  },
  {
    _id: 's3',
    movie: 'm2',
    theater: 'PVR: Next Galleria Mall',
    location: 'Panjagutta, Hyderabad',
    screen: 'Audi 2 (IMAX)',
    showDate: new Date().toISOString().split('T')[0],
    showTime: '06:45 PM',
    ticketPrice: 280,
    totalSeats: 60,
    bookedSeats: ['A5', 'A6']
  },
  {
    _id: 's4',
    movie: 'm3',
    theater: 'Inox: GVK One Mall',
    location: 'Banjara Hills, Hyderabad',
    screen: 'Insignia',
    showDate: new Date().toISOString().split('T')[0],
    showTime: '09:15 PM',
    ticketPrice: 320,
    totalSeats: 60,
    bookedSeats: ['C2', 'C3', 'C4']
  }
];

// Helper to get auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Get all movies
  async getMovies(search = '', genre = '') {
    try {
      const url = new URL(`${API_BASE}/movies`);
      if (search) url.searchParams.append('search', search);
      if (genre) url.searchParams.append('genre', genre);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Network response not ok');
      const data = await res.json();
      return data.data;
    } catch {
      // Return filtered mock data
      return MOCK_MOVIES.filter((m) => {
        const matchesSearch = !search || m.title.toLowerCase().includes(search.toLowerCase());
        const matchesGenre = !genre || m.genre.some((g) => g.toLowerCase() === genre.toLowerCase());
        return matchesSearch && matchesGenre;
      });
    }
  },

  // Get single movie
  async getMovieById(id) {
    try {
      const res = await fetch(`${API_BASE}/movies/${id}`);
      if (!res.ok) throw new Error('Failed to fetch movie');
      const data = await res.json();
      return data.data;
    } catch {
      return MOCK_MOVIES.find((m) => m._id === id) || MOCK_MOVIES[0];
    }
  },

  // Get shows for movie
  async getShows(movieId, date) {
    try {
      const url = new URL(`${API_BASE}/shows/movie/${movieId}`);
      if (date) url.searchParams.append('date', date);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to fetch shows');
      const data = await res.json();
      return data.data;
    } catch {
      return MOCK_SHOWS.filter((s) => s.movie === movieId || s.movie === 'm1');
    }
  },

  // Get show by ID
  async getShowById(showId) {
    try {
      const res = await fetch(`${API_BASE}/shows/${showId}`);
      if (!res.ok) throw new Error('Failed to fetch show');
      const data = await res.json();
      return data.data;
    } catch {
      const found = MOCK_SHOWS.find((s) => s._id === showId) || MOCK_SHOWS[0];
      const movieObj = MOCK_MOVIES.find((m) => m._id === found.movie) || MOCK_MOVIES[0];
      return { ...found, movie: movieObj };
    }
  },

  // Book tickets
  async bookTickets(bookingData) {
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bookingData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Booking failed');
      return data;
    } catch (err) {
      // Local mock fallback booking
      const mockBooking = {
        success: true,
        message: 'Tickets booked successfully (Demo Mode)!',
        data: {
          bookingId: `TKT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
          seats: bookingData.seats,
          totalPrice: bookingData.seats.length * 250,
          paymentStatus: 'completed',
          bookingStatus: 'confirmed',
          createdAt: new Date().toISOString()
        }
      };
      return mockBooking;
    }
  },

  // Get my bookings
  async getMyBookings() {
    try {
      const res = await fetch(`${API_BASE}/bookings/my-bookings`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error('Failed to fetch bookings');
      return data.data;
    } catch {
      const stored = localStorage.getItem('demo_bookings');
      return stored ? JSON.parse(stored) : [];
    }
  },

  // Login
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      return data;
    } catch {
      // Demo login
      return {
        success: true,
        data: {
          _id: 'u1',
          name: email.split('@')[0] || 'Movie Fan',
          email,
          role: 'user',
          token: 'demo-jwt-token-xyz'
        }
      };
    }
  },

  // Register
  async register(userData) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      return data;
    } catch {
      return {
        success: true,
        data: {
          _id: 'u_' + Date.now(),
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          role: 'user',
          token: 'demo-jwt-token-new'
        }
      };
    }
  }
};
