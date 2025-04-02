const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { check } = require('express-validator');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], authController.registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], authController.loginUser);

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', authMiddleware, authController.getUser);

module.exports = router;