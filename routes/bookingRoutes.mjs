import express from 'express';
import {
  createBooking,
  getMyBookings,
  getLandlordBookings,
  updateBookingStatus,
  cancelBooking
} from '../controllers/bookingController.mjs';
import { protect, authorize } from '../middleware/auth.mjs';

const router = express.Router();

router.post('/', protect, authorize('student'), createBooking);
router.get('/my-bookings', protect, authorize('student'), getMyBookings);
router.get('/landlord-bookings', protect, authorize('landlord'), getLandlordBookings);
router.put('/:id/status', protect, authorize('landlord', 'admin'), updateBookingStatus);
router.put('/:id/cancel', protect, authorize('student'), cancelBooking);

export default router;