import { body, validationResult } from 'express-validator';

export const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessages = errors.array().map(err => err.msg).join(', ');
    res.status(400).json({
      success: false,
      message: errorMessages
    });
  };
};

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['student', 'landlord']).withMessage('Invalid role')
];

export const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

export const propertyValidation = [
  body('title').trim().notEmpty().withMessage('Property title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('type').isIn(['room', 'apartment', 'pg', 'hostel', 'studio']).withMessage('Invalid property type'),
  body('price.amount').isNumeric().withMessage('Price must be a number'),
  body('university').trim().notEmpty().withMessage('University is required')
];