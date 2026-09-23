const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { authenticate } = require('../middleware/auth');

// Get all favorites for current user
router.get('/', authenticate, favoriteController.getUserFavorites);

// Add a scheme to favorites
router.post('/', authenticate, favoriteController.addFavorite);

// Remove a scheme from favorites
router.delete('/:schemeId', authenticate, favoriteController.removeFavorite);

// Check if a scheme is favorited
router.get('/check/:schemeId', authenticate, favoriteController.checkFavorite);

module.exports = router;
