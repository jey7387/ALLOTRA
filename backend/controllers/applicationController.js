const Application = require('../models/Application');
const ApplicationDetails = require('../models/ApplicationDetails');
const Document = require('../models/Document');
const Waitlist = require('../models/Waitlist');
const Allotment = require('../models/Allotment');
const Scheme = require('../models/Scheme');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.createApplication = async (req, res) => {
  try {
    const { scheme_id, details } = req.body;
    const user_id = req.user.userId;

    const existingApplication = await Application.findByUserId(user_id);
    const alreadyApplied = existingApplication.find(app => app.scheme_id === parseInt(scheme_id));
    
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this scheme' });
    }

    const application = await Application.create({ user_id, scheme_id: parseInt(scheme_id) });

    if (details) {
      await ApplicationDetails.create({
        application_id: application.id,
        ...details
      });
    }

    await Notification.create({
      user_id,
      title: 'Application Submitted',
      message: `Your application for scheme has been submitted successfully.`,
      type: 'success'
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ message: 'Error submitting application' });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.findByUserId(req.user.userId);

    for (const app of applications) {
      const details = await ApplicationDetails.findByApplicationId(app.id);
      const documents = await Document.findByApplicationId(app.id);
      const waitlist = await Waitlist.findByApplicationId(app.id);
      const allotment = await Allotment.findByApplicationId(app.id);
      const scheme = await Scheme.findById(app.scheme_id);

      app.details = details;
      app.documents = documents;
      app.waitlist = waitlist;
      app.allotment = allotment;
      app.scheme_name = scheme ? scheme.name : 'Unknown Scheme';
      app.location = scheme ? scheme.location : 'Unknown Location';
      app.price = scheme ? scheme.price : 0;
    }

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Error fetching applications' });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const { status, scheme_id } = req.query;
    const filters = {};
    
    if (status) filters.status = status;
    if (scheme_id) filters.scheme_id = scheme_id;

    const applications = await Application.findAll(filters);

    for (const app of applications) {
      const details = await ApplicationDetails.findByApplicationId(app.id);
      const documents = await Document.findByApplicationId(app.id);
      const scheme = await Scheme.findById(app.scheme_id);
      const user = await User.findById(app.user_id);

      app.details = details;
      app.documents = documents;
      app.scheme_name = scheme ? scheme.name : 'Unknown Scheme';
      app.location = scheme ? scheme.location : 'Unknown Location';
      app.price = scheme ? scheme.price : 0;
      app.full_name = user ? user.full_name : 'Unknown User';
      app.email = user ? user.email : 'Unknown Email';
      app.phone = user ? user.phone : 'Unknown Phone';
    }

    res.json(applications);
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({ message: 'Error fetching applications' });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const details = await ApplicationDetails.findByApplicationId(application.id);
    const documents = await Document.findByApplicationId(application.id);
    const waitlist = await Waitlist.findByApplicationId(application.id);
    const allotment = await Allotment.findByApplicationId(application.id);
    const scheme = await Scheme.findById(application.scheme_id);
    const user = await User.findById(application.user_id);

    application.details = details;
    application.documents = documents;
    application.waitlist = waitlist;
    application.allotment = allotment;
    application.scheme_name = scheme ? scheme.name : 'Unknown Scheme';
    application.location = scheme ? scheme.location : 'Unknown Location';
    application.price = scheme ? scheme.price : 0;
    application.full_name = user ? user.full_name : 'Unknown User';
    application.email = user ? user.email : 'Unknown Email';
    application.phone = user ? user.phone : 'Unknown Phone';

    res.json(application);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Error fetching application' });
  }
};

exports.getApplicationStats = async (req, res) => {
  try {
    const stats = await Application.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({ message: 'Error fetching application stats' });
  }
};

exports.getMonthlyStats = async (req, res) => {
  try {
    const monthlyStats = await Application.getMonthlyStats();
    res.json(monthlyStats);
  } catch (error) {
    console.error('Get monthly stats error:', error);
    res.status(500).json({ message: 'Error fetching monthly stats' });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const application = await Application.update(id, updates);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (updates.status) {
      const app = await Application.findById(id);
      await Notification.create({
        user_id: app.user_id,
        title: 'Application Status Updated',
        message: `Your application status has been updated to ${updates.status}`,
        type: 'info'
      });
    }

    res.json({
      message: 'Application updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Error updating application' });
  }
};

exports.updateApplicationDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const details = await ApplicationDetails.update(id, updates);
    if (!details) {
      return res.status(404).json({ message: 'Application details not found' });
    }

    res.json({
      message: 'Application details updated successfully',
      details
    });
  } catch (error) {
    console.error('Update application details error:', error);
    res.status(500).json({ message: 'Error updating application details' });
  }
};

exports.getApplicationStats = async (req, res) => {
  try {
    const stats = await Application.getStats();
    const monthlyStats = await Application.getMonthlyStats();

    res.json({
      ...stats,
      monthly: monthlyStats
    });
  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({ message: 'Error fetching application statistics' });
  }
};
