import express from 'express';
import {
  getShowsByMovie,
  getShowById,
  createShow,
  deleteShow
} from '../controllers/showController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/movie/:movieId', getShowsByMovie);
router.get('/:id', getShowById);

// Admin-only routes
router.post('/', protect, adminOnly, createShow);
router.delete('/:id', protect, adminOnly, deleteShow);

export default router;
