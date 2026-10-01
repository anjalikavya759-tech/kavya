import Booking from '../models/Booking.js';
import Show from '../models/Show.js';

// Helper to generate unique booking ID
const generateBookingId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(100 + Math.random() * 900);
  return `TKT-${timestamp}-${random}`;
};

// @desc    Create new ticket booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
  try {
    const { showId, seats, paymentMethod } = req.body;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid showId and selected seats array'
      });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    // Check seat availability - prevent double booking
    const alreadyBooked = seats.some((seat) => show.bookedSeats.includes(seat));
    if (alreadyBooked) {
      return res.status(400).json({
        success: false,
        message: 'One or more of the selected seats have already been booked. Please select different seats.'
      });
    }

    // Calculate total price
    const totalPrice = seats.length * show.ticketPrice;

    // Create booking
    const booking = await Booking.create({
      bookingId: generateBookingId(),
      user: req.user._id,
      movie: show.movie,
      show: show._id,
      seats,
      totalPrice,
      paymentMethod: paymentMethod || 'UPI / Card',
      paymentStatus: 'completed',
      bookingStatus: 'confirmed'
    });

    // Add booked seats to show
    show.bookedSeats.push(...seats);
    await show.save();

    // Populate movie & show details for full response
    const fullBooking = await Booking.findById(booking._id)
      .populate('movie', 'title poster duration language')
      .populate('show', 'theater screen showDate showTime ticketPrice')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Tickets booked successfully!',
      data: fullBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title poster duration language')
      .populate('show', 'theater screen showDate showTime ticketPrice')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking details by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie', 'title poster duration language genre')
      .populate('show', 'theater screen showDate showTime ticketPrice location')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Ensure only the ticket owner or admin can view
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this ticket'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check ownership
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    // Release seats in the show
    const show = await Show.findById(booking.show);
    if (show) {
      show.bookedSeats = show.bookedSeats.filter(
        (seat) => !booking.seats.includes(seat)
      );
      await show.save();
    }

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully and seats released',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};
