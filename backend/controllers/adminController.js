const User = require('../models/User');
const Scheme = require('../models/Scheme');
const Application = require('../models/Application');

exports.getDashboardStats = async (req, res) => {
  try {
    const userStats = await User.getStats();
    const schemeStats = await Scheme.getStats();
    const applicationStats = await Application.getStats();

    res.json({
      users: userStats,
      schemes: schemeStats,
      applications: applicationStats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filters = {};
    
    if (role) filters.role = role;

    const users = await User.findAll(filters);

    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.delete(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};
