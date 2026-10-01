import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Movie description is required']
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required']
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      default: 'Telugu'
    },
    duration: {
      type: Number, // duration in minutes
      required: [true, 'Duration in minutes is required']
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required']
    },
    rating: {
      type: Number,
      default: 8.5,
      min: 0,
      max: 10
    },
    poster: {
      type: String, // image URL
      default: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500'
    },
    banner: {
      type: String, // wide banner URL
      default: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200'
    },
    trailerUrl: {
      type: String,
      default: ''
    },
    director: {
      type: String,
      default: ''
    },
    cast: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
