const Scheme = require('../models/Scheme');

exports.createScheme = async (req, res) => {
  try {
    const schemeData = req.body;
    const scheme = await Scheme.create(schemeData);

    res.status(201).json({
      message: 'Scheme created successfully',
      scheme
    });
  } catch (error) {
    console.error('Create scheme error:', error);
    res.status(500).json({ message: 'Error creating scheme' });
  }
};

exports.getAllSchemes = async (req, res) => {
  try {
    const { category, available_only } = req.query;
    const filters = {};
    
    if (category) filters.category = category;
    if (available_only === 'true') filters.available_only = true;

    const schemes = await Scheme.findAll(filters);

    res.json(schemes);
  } catch (error) {
    console.error('Get schemes error:', error);
    res.status(500).json({ message: 'Error fetching schemes' });
  }
};

exports.getSchemeById = async (req, res) => {
  try {
    const { id } = req.params;
    const scheme = await Scheme.findById(id);

    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }

    res.json(scheme);
  } catch (error) {
    console.error('Get scheme error:', error);
    res.status(500).json({ message: 'Error fetching scheme' });
  }
};

exports.updateScheme = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const scheme = await Scheme.update(id, updates);
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }

    res.json({
      message: 'Scheme updated successfully',
      scheme
    });
  } catch (error) {
    console.error('Update scheme error:', error);
    res.status(500).json({ message: 'Error updating scheme' });
  }
};

exports.deleteScheme = async (req, res) => {
  try {
    const { id } = req.params;
    const scheme = await Scheme.delete(id);

    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }

    res.json({
      message: 'Scheme deleted successfully'
    });
  } catch (error) {
    console.error('Delete scheme error:', error);
    res.status(500).json({ message: 'Error deleting scheme' });
  }
};

exports.getSchemeStats = async (req, res) => {
  try {
    const stats = await Scheme.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Get scheme stats error:', error);
    res.status(500).json({ message: 'Error fetching scheme statistics' });
  }
};
