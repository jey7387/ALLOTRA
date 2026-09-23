const Allotment = require('../models/Allotment');
const Application = require('../models/Application');
const Scheme = require('../models/Scheme');
const Waitlist = require('../models/Waitlist');
const Notification = require('../models/Notification');

exports.createAllotment = async (req, res) => {
  try {
    const { application_id, unit_number, allotment_date, possession_date } = req.body;
    const allotted_by = req.user.userId;

    const application = await Application.findById(application_id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const allotment = await Allotment.create({
      application_id,
      scheme_id: application.scheme_id,
      unit_number,
      allotment_date,
      possession_date,
      allotted_by
    });

    await Application.update(application_id, { status: 'allotted' });
    await Waitlist.delete(application_id);
    await Scheme.updateAvailableUnits(application.scheme_id, -1);

    await Notification.create({
      user_id: application.user_id,
      title: 'Allotment Approved',
      message: `Congratulations! You have been allotted unit ${unit_number}. Allotment date: ${allotment_date}`,
      type: 'success'
    });

    res.status(201).json({
      message: 'Allotment created successfully',
      allotment
    });
  } catch (error) {
    console.error('Create allotment error:', error);
    res.status(500).json({ message: 'Error creating allotment' });
  }
};

exports.getMyAllotments = async (req, res) => {
  try {
    const allotments = await Allotment.findByUserId(req.user.userId);

    res.json(allotments);
  } catch (error) {
    console.error('Get my allotments error:', error);
    res.status(500).json({ message: 'Error fetching allotments' });
  }
};

exports.getSchemeAllotments = async (req, res) => {
  try {
    const { scheme_id } = req.params;
    const allotments = await Allotment.findBySchemeId(scheme_id);

    res.json(allotments);
  } catch (error) {
    console.error('Get scheme allotments error:', error);
    res.status(500).json({ message: 'Error fetching allotments' });
  }
};

exports.getAllotmentStats = async (req, res) => {
  try {
    const stats = await Allotment.getStats();

    res.json(stats);
  } catch (error) {
    console.error('Get allotment stats error:', error);
    res.status(500).json({ message: 'Error fetching allotment statistics' });
  }
};
