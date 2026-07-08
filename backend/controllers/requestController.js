import Donation from '../models/Donation.js';
import Request from '../models/Request.js';
import User from '../models/User.js';

// @desc    Create a claim request for a donation
// @route   POST /api/requests
// @access  Private (Receiver only)
export const createRequest = async (req, res) => {
  try {
    const { donationId, notes } = req.body;

    if (!donationId) {
      return res.status(400).json({ success: false, message: 'Please provide a donation ID' });
    }

    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Food donation listing not found' });
    }

    if (donation.status !== 'available') {
      return res.status(400).json({ success: false, message: 'This food item is not available' });
    }

    // Check for duplicate pending request from the same receiver
    const alreadyRequested = await Request.findOne({
      donationId,
      receiverId: req.user._id,
      status: 'pending'
    });

    if (alreadyRequested) {
      return res.status(400).json({ success: false, message: 'You have already submitted a pending request for this item' });
    }

    const request = await Request.create({
      donationId,
      receiverId: req.user._id,
      donorId: donation.donor,
      status: 'pending',
      notes: notes || ''
    });

    return res.status(201).json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user requests (Receivers see their claims, Donors see requests for their items)
// @route   GET /api/requests/my
// @access  Private
export const getMyRequests = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'receiver') {
      query.receiverId = req.user._id;
    } else if (req.user.role === 'donor') {
      query.donorId = req.user._id;
    } else {
      // Admins see all requests
      query = {};
    }

    const requests = await Request.find(query)
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

// @desc    Accept or Reject a request
// @route   PUT /api/requests/:id
// @access  Private (Donor owner only)
export const manageRequest = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Please specify status as accepted or rejected' });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'This request has already been handled' });
    }

    // Verify authorized user (must be the donor owner of the request/donation)
    if (request.donorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage this request' });
    }

    if (status === 'accepted') {
      const donation = await Donation.findById(request.donationId);
      if (!donation) {
        return res.status(404).json({ success: false, message: 'Associated donation listing not found' });
      }

      if (donation.status !== 'available') {
        return res.status(400).json({ success: false, message: 'This food item is no longer available' });
      }

      // Fetch claimant profile details
      const receiver = await User.findById(request.receiverId);

      // Update Donation properties
      donation.status = 'reserved';
      donation.receiverId = request.receiverId;
      donation.receiverName = receiver ? receiver.name : 'Receiver';
      donation.receiverPhone = receiver ? receiver.phone : '';
      donation.claimedAt = new Date();
      await donation.save();

      // Accept this request
      request.status = 'accepted';
      await request.save();

      // Reject all other pending requests for the same donation
      await Request.updateMany(
        {
          donationId: request.donationId,
          _id: { $ne: request._id },
          status: 'pending'
        },
        { status: 'rejected' }
      );
    } else {
      // Reject request
      request.status = 'rejected';
      await request.save();
    }

    return res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel a pending request
// @route   DELETE /api/requests/:id
// @access  Private (Owner receiver only)
export const cancelRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending requests can be cancelled' });
    }

    // Verify authorized user (must be the receiver who submitted the request)
    if (request.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this request' });
    }

    await Request.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: 'Request successfully cancelled and removed'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
