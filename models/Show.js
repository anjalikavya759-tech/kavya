import mongoose from 'mongoose';

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required']
    },
    theater: {
      type: String,
      required: [true, 'Theater name is required'],
      trim: true
    },
    location: {
      type: String,
      default: 'Hyderabad'
    },
    screen: {
      type: String,
      default: 'Screen 1'
    },
    showDate: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'Show date is required']
    },
    showTime: {
      type: String, // Format: e.g. "11:00 AM", "02:30 PM", "06:45 PM", "10:00 PM"
      required: [true, 'Show time is required']
    },
    ticketPrice: {
      type: Number,
      required: [true, 'Ticket price is required'],
      default: 200
    },
    totalSeats: {
      type: Number,
      default: 60
    },
    bookedSeats: {
      type: [String], // Array of seat IDs like ["A1", "A2", "C4"]
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Show = mongoose.model('Show', showSchema);
export default Show;
