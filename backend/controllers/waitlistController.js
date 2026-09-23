const Waitlist = require('../models/Waitlist');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

exports.generateWaitlist = async (req, res) => {
  try {
    const { scheme_id } = req.params;

    const waitlist = await Waitlist.generateWaitlist(scheme_id);

    res.json({
      message: 'Waitlist generated successfully',
      waitlist
    });
  } catch (error) {
    console.error('Generate waitlist error:', error);
    res.status(500).json({ message: 'Error generating waitlist' });
  }
};

exports.getSchemeWaitlist = async (req, res) => {
  try {
    const { scheme_id } = req.params;
    const waitlist = await Waitlist.findBySchemeId(scheme_id);

    res.json(waitlist);
  } catch (error) {
    console.error('Get waitlist error:', error);
    res.status(500).json({ message: 'Error fetching waitlist' });
  }
};

exports.getMyWaitlist = async (req, res) => {
  try {
    const waitlist = await Waitlist.findByUserId(req.user.userId);

    res.json(waitlist);
  } catch (error) {
    console.error('Get my waitlist error:', error);
    res.status(500).json({ message: 'Error fetching waitlist' });
  }
};

exports.updateWaitlistRank = async (req, res) => {
  try {
    const { application_id } = req.params;
    const { rank } = req.body;

    const waitlist = await Waitlist.updateRank(application_id, rank);

    const application = await Application.findById(application_id);
    await Notification.create({
      user_id: application.user_id,
      title: 'Waitlist Updated',
      message: `Your waitlist rank has been updated to ${rank}`,
      type: 'info'
    });

    res.json({
      message: 'Waitlist rank updated successfully',
      waitlist
    });
  } catch (error) {
    console.error('Update waitlist rank error:', error);
    res.status(500).json({ message: 'Error updating waitlist rank' });
  }
};

exports.removeFromWaitlist = async (req, res) => {
  try {
    const { application_id } = req.params;
    const waitlist = await Waitlist.delete(application_id);

    res.json({
      message: 'Removed from waitlist successfully'
    });
  } catch (error) {
    console.error('Remove from waitlist error:', error);
    res.status(500).json({ message: 'Error removing from waitlist' });
  }
};
