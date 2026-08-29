import express from 'express';
import {
  createReview,
  getPropertyReviews,
  updateReview,
  deleteReview
} from '../controllers/reviewController.mjs';
import { protect } from '../middleware/auth.mjs';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/property/:propertyId', getPropertyReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;