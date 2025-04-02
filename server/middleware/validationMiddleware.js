const { body, validationResult } = require('express-validator');

// Example validation for email and password in the registration process
exports.registerValidation = [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  // Add any other validation rules as needed
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password').exists().withMessage('Password is required'),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
