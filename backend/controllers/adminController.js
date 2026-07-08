import User from '../models/User.js';
import Donation from '../models/Donation.js';
import Request from '../models/Request.js';

// @desc    Get all users (excluding passwords)
// @route   GET /api/admin/users
// @access  Private (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all food donations
// @route   GET /api/admin/donations
// @access  Private (Admin only)
export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: donations.length,
      data: donations
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all claims requests
// @route   GET /api/admin/requests
// @access  Private (Admin only)
export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('donationId')
      .populate('receiverId', 'name email phone address')
      .populate('donorId', 'name email phone address')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete any donation listing (Inappropriate content)
// @route   DELETE /api/admin/donations/:id
// @access  Private (Admin only)
export const deleteInappropriateDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Surplus food listing not found' });
    }

    // Delete listing document
    await Donation.findByIdAndDelete(req.params.id);

    // Delete associated requests logs
    await Request.deleteMany({ donationId: req.params.id });

    return res.json({
      success: true,
      message: 'Inappropriate listing and associated request logs successfully removed'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get platform metrics and statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const donors = await User.countDocuments({ role: 'donor' });
    const receivers = await User.countDocuments({ role: 'receiver' });

    const totalDonations = await Donation.countDocuments();
    const availableDonations = await Donation.countDocuments({ status: 'available' });
    const reservedDonations = await Donation.countDocuments({ status: 'reserved' });
    const completedDonations = await Donation.countDocuments({ status: 'completed' });

    const totalRequests = await Request.countDocuments();

    return res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          donors,
          receivers
        },
        donations: {
          total: totalDonations,
          available: availableDonations,
          reserved: reservedDonations,
          completed: completedDonations
        },
        requests: {
          total: totalRequests
        }
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
