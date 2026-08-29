import express from 'express';
import {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  searchProperties,
  getStats
} from '../controllers/propertyController.mjs';
import { protect, authorize } from '../middleware/auth.mjs';
import { validate, propertyValidation } from '../middleware/validation.mjs';

const router = express.Router();

router.get('/', getAllProperties);
router.get('/search', searchProperties);
router.get('/stats', getStats);
router.get('/my-properties', protect, authorize('landlord', 'admin'), getMyProperties);
router.get('/:id', getProperty);
router.post('/', protect, authorize('landlord', 'admin'), validate(propertyValidation), createProperty);
router.put('/:id', protect, authorize('landlord', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('landlord', 'admin'), deleteProperty);

export default router;