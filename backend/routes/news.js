const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { authenticate } = require('../middleware/auth');

// Get all news and announcements
router.get('/', authenticate, newsController.getAllNews);

// Get news by ID
router.get('/:id', authenticate, newsController.getNewsById);

module.exports = router;
