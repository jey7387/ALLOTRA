const Favorite = require('../models/Favorite');

// Get all favorites for current user
exports.getUserFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findByUserId(req.user.id);
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorites', error: error.message });
  }
};

// Add a scheme to favorites
exports.addFavorite = async (req, res) => {
  try {
    const { schemeId, schemeName } = req.body;
    
    // Check if already favorited
    const existing = await Favorite.findByUserAndScheme(req.user.id, schemeId);
    if (existing) {
      return res.status(400).json({ message: 'Scheme already in favorites' });
    }
    
    const favorite = await Favorite.create({
      user_id: req.user.id,
      scheme_id: schemeId,
      scheme_name: schemeName
    });
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: 'Error adding favorite', error: error.message });
  }
};

// Remove a scheme from favorites
exports.removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.delete(req.user.id, req.params.schemeId);
    
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    
    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing favorite', error: error.message });
  }
};

// Check if a scheme is favorited
exports.checkFavorite = async (req, res) => {
  try {
    const isFavorited = await Favorite.checkFavorite(req.user.id, req.params.schemeId);
    res.json({ isFavorited });
  } catch (error) {
    res.status(500).json({ message: 'Error checking favorite', error: error.message });
  }
};
