import Show from '../models/Show.js';

// @desc    Get all shows for a specific movie (optionally filtered by date)
// @route   GET /api/shows/movie/:movieId
// @access  Public
export const getShowsByMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const { date } = req.query;

    let filter = { movie: movieId };
    if (date) {
      filter.showDate = date; // e.g. '2026-10-02'
    }

    const shows = await Show.find(filter)
      .populate('movie', 'title poster duration language genre')
      .sort({ showDate: 1, showTime: 1 });

    res.json({
      success: true,
      count: shows.length,
      data: shows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get show details by ID (including seat layout & booked seats)
// @route   GET /api/shows/:id
// @access  Public
export const getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id).populate('movie');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    res.json({
      success: true,
      data: show
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new show
// @route   POST /api/shows
// @access  Private/Admin
export const createShow = async (req, res, next) => {
  try {
    const { movie, theater, location, screen, showDate, showTime, ticketPrice, totalSeats } = req.body;

    if (!movie || !theater || !showDate || !showTime) {
      return res.status(400).json({
        success: false,
        message: 'Movie, theater, showDate, and showTime are required'
      });
    }

    const show = await Show.create({
      movie,
      theater,
      location: location || 'Hyderabad',
      screen: screen || 'Screen 1',
      showDate,
      showTime,
      ticketPrice: ticketPrice || 200,
      totalSeats: totalSeats || 60,
      bookedSeats: []
    });

    res.status(201).json({
      success: true,
      message: 'Show scheduled successfully',
      data: show
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a show
// @route   DELETE /api/shows/:id
// @access  Private/Admin
export const deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    res.json({
      success: true,
      message: 'Show removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
