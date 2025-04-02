const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(commentController.getComments)
  .post(commentController.createComment);

router.route('/:id')
  .get(commentController.getComment)
  .put(commentController.updateComment)
  .delete(commentController.deleteComment);

module.exports = router;