import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Movie from './models/Movie.js';
import Show from './models/Show.js';
import Booking from './models/Booking.js';
import connectDB from './config/db.js';

dotenv.config();

const sampleMovies = [
  {
    title: 'Devara: Part 1',
    description: 'An epic action saga set against the coastal lands, where an unyielding man fights to protect his people.',
    genre: ['Action', 'Drama', 'Thriller'],
    language: 'Telugu',
    duration: 178,
    releaseDate: new Date('2024-09-27'),
    rating: 8.6,
    director: 'Koratala Siva',
    cast: ['NTR Jr.', 'Janhvi Kapoor', 'Saif Ali Khan'],
    poster: 'https://image.tmdb.org/t/p/w500/A73mD9J2C4G3F2KqN0Q9x9E1h2L.jpg',
    banner: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200'
  },
  {
    title: 'Kalki 2898 AD',
    description: 'A modern avatar of Vishnu descends to Earth to protect the world from evil forces in a dystopian world.',
    genre: ['Sci-Fi', 'Action', 'Mythology'],
    language: 'Telugu',
    duration: 181,
    releaseDate: new Date('2024-06-27'),
    rating: 8.9,
    director: 'Nag Ashwin',
    cast: ['Prabhas', 'Amitabh Bachchan', 'Deepika Padukone', 'Kamal Haasan'],
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
    banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200'
  },
  {
    title: 'Pushpa 2: The Rule',
    description: 'Pushpa Raj continues his reign over the red sandalwood smuggling empire facing immense opposition.',
    genre: ['Action', 'Crime', 'Drama'],
    language: 'Telugu',
    duration: 185,
    releaseDate: new Date('2024-12-05'),
    rating: 9.1,
    director: 'Sukumar',
    cast: ['Allu Arjun', 'Rashmika Mandanna', 'Fahadh Faasil'],
    poster: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500',
    banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200'
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Booking.deleteMany();
    await Show.deleteMany();
    await Movie.deleteMany();
    await User.deleteMany();

    console.log('🗑️ Existing data cleared...');

    // Create users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@movieticket.com',
      password: 'adminpassword123',
      phone: '9876543210',
      role: 'admin'
    });

    const normalUser = await User.create({
      name: 'Ravi Kumar',
      email: 'user@movieticket.com',
      password: 'userpassword123',
      phone: '9123456780',
      role: 'user'
    });

    console.log('👤 Users created (admin@movieticket.com & user@movieticket.com)...');

    // Create movies
    const createdMovies = await Movie.insertMany(sampleMovies);
    console.log(`🎬 ${createdMovies.length} Movies inserted...`);

    // Create shows for the first movie
    const today = new Date().toISOString().split('T')[0];
    const shows = [
      {
        movie: createdMovies[0]._id,
        theater: 'Prasads Multiplex: Large Screen',
        location: 'Necklace Road, Hyderabad',
        screen: 'Screen 1 (Dolby Atmos)',
        showDate: today,
        showTime: '11:00 AM',
        ticketPrice: 250,
        totalSeats: 60,
        bookedSeats: ['A1', 'A2', 'B4']
      },
      {
        movie: createdMovies[0]._id,
        theater: 'AMB Cinemas',
        location: 'Gachibowli, Hyderabad',
        screen: 'Screen 4 (4K Laser)',
        showDate: today,
        showTime: '02:30 PM',
        ticketPrice: 295,
        totalSeats: 60,
        bookedSeats: ['C1', 'C2']
      },
      {
        movie: createdMovies[1]._id,
        theater: 'PVR: Next Galleria Mall',
        location: 'Panjagutta, Hyderabad',
        screen: 'Audi 2',
        showDate: today,
        showTime: '06:45 PM',
        ticketPrice: 220,
        totalSeats: 60,
        bookedSeats: []
      }
    ];

    await Show.insertMany(shows);
    console.log('🎟️ Shows created successfully...');

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeder error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
