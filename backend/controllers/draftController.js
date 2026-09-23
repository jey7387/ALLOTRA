const Draft = require('../models/Draft');

// Get all drafts for current user
exports.getUserDrafts = async (req, res) => {
  try {
    const drafts = await Draft.findByUserId(req.user.id);
    res.json(drafts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drafts', error: error.message });
  }
};

// Create a new draft
exports.createDraft = async (req, res) => {
  try {
    const draft = await Draft.create({
      user_id: req.user.id,
      scheme_id: req.body.schemeId,
      scheme_name: req.body.schemeName,
      data: req.body.data,
      completion_percentage: req.body.completionPercentage || 0
    });
    res.status(201).json(draft);
  } catch (error) {
    res.status(500).json({ message: 'Error creating draft', error: error.message });
  }
};

// Update a draft
exports.updateDraft = async (req, res) => {
  try {
    const draft = await Draft.update(req.params.id, {
      data: req.body.data,
      completion_percentage: req.body.completionPercentage
    });
    
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }
    
    res.json(draft);
  } catch (error) {
    res.status(500).json({ message: 'Error updating draft', error: error.message });
  }
};

// Delete a draft
exports.deleteDraft = async (req, res) => {
  try {
    const draft = await Draft.delete(req.params.id);
    
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }
    
    res.json({ message: 'Draft deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting draft', error: error.message });
  }
};
