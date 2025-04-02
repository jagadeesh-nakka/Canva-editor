const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body, validationResult } = require('express-validator');

// Registration route with inline validation
router.post('/register', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], (req, res, next) => {
  // Validation check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, authController.register);

// Login route with inline validation
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .exists()
    .withMessage('Password is required')
], (req, res, next) => {
  // Validation check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, authController.login);

// Route to get user info
router.get('/me', authController.getMe);

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Attach user info to request
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};


module.exports = router;
