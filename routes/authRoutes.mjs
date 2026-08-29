import express from 'express';
import { register, login, getMe, updateProfile, changePassword } from '../controllers/authController.mjs';
import { protect } from '../middleware/auth.mjs';
import { validate, registerValidation, loginValidation } from '../middleware/validation.mjs';

const router = express.Router();

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;