const express = require('express');
const { createDesign, getDesigns } = require('../controllers/designController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createDesign);
router.get('/', authMiddleware, getDesigns);

module.exports = router;
