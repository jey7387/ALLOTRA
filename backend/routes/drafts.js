const express = require('express');
const router = express.Router();
const draftController = require('../controllers/draftController');
const { authenticate } = require('../middleware/auth');

// Get all drafts for current user
router.get('/', authenticate, draftController.getUserDrafts);

// Create a new draft
router.post('/', authenticate, draftController.createDraft);

// Update a draft
router.put('/:id', authenticate, draftController.updateDraft);

// Delete a draft
router.delete('/:id', authenticate, draftController.deleteDraft);

module.exports = router;
