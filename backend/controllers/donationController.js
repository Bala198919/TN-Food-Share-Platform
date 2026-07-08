import Donation from '../models/Donation.js';

// @desc    Create a new surplus food listing
// @route   POST /api/donations
// @access  Private (Donor only)
export const createDonation = async (req, res) => {
  try {
    const { 
      providerName, 
      state, 
      city, 
      area, 
      pickupAddress, 
      contact, 
      donationDate, 
      availableFrom, 
      availableUntil, 
      coverImage, 
      notes, 
      foodItems,
      coordinates
    } = req.body;

    if (!providerName || !city || !area || !pickupAddress || !contact) {
      return res.status(400).json({ success: false, message: 'Please add all required provider and location details' });
    }

    if (!foodItems || foodItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Please add at least one food item' });
    }

    // Set first food item's image as cover image if no cover image was explicitly provided
    let finalCoverImage = coverImage || '';
    if (!finalCoverImage && foodItems[0] && foodItems[0].image) {
      finalCoverImage = foodItems[0].image;
    }

    // Setup coordinates defaults map
    const defaultCityCoordinates = {
      'chennai': { lat: 13.0827, lng: 80.2707 },
      'coimbatore': { lat: 11.0168, lng: 76.9558 },
      'madurai': { lat: 9.9252, lng: 78.1198 },
      'trichy': { lat: 10.7905, lng: 78.7047 },
      'salem': { lat: 11.6643, lng: 78.1460 },
      'erode': { lat: 11.3410, lng: 77.7172 },
      'tirunelveli': { lat: 8.7139, lng: 77.7567 },
      'thanjavur': { lat: 10.7870, lng: 79.1378 },
      'vellore': { lat: 12.9165, lng: 79.1325 },
      'tuticorin': { lat: 8.7642, lng: 78.1348 }
    };

    let finalCoordinates = coordinates || {};
    if (!finalCoordinates.lat || !finalCoordinates.lng) {
      const cityKey = city.toLowerCase().trim();
      if (defaultCityCoordinates[cityKey]) {
        finalCoordinates = defaultCityCoordinates[cityKey];
      } else {
        finalCoordinates = { lat: 13.0827, lng: 80.2707 }; // Fallback to Chennai
      }
    }

    const donation = await Donation.create({
      donor: req.user._id,
      providerName,
      state: state || 'Tamil Nadu',
      city,
      area,
      pickupAddress,
      contact,
      donationDate: donationDate || new Date(),
      availableFrom,
      availableUntil,
      coverImage: finalCoverImage,
      notes,
      foodItems,
      coordinates: finalCoordinates,
      status: 'available'
    });

    return res.status(201).json({
      success: true,
      data: donation
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all donations with filters and search
// @route   GET /api/donations
// @access  Public
export const getDonations = async (req, res) => {
  try {
    const { search, city, category, foodType, status, page = 1, limit = 12 } = req.query;
    let query = {};

    // 1. Filter by location
    if (city && city !== 'all') {
      query.city = { $regex: new RegExp('^' + city + '$', 'i') };
    }

    // 2. Filter by status (default: show available only for public browsing if not specified)
    if (status && status !== 'all') {
      query.status = status;
    } else if (!status) {
      query.status = 'available';
    }

    // 3. Filter by food category (breakfast, lunch, dinner, snacks)
    if (category && category !== 'all') {
      query['foodItems.category'] = category.toLowerCase();
    }

    // 4. Filter by food type (veg, non-veg)
    if (foodType && foodType !== 'all') {
      query['foodItems.foodType'] = foodType.toLowerCase();
    }

    // 5. Keyword search: match food item name, description, provider name, city, area, or notes
    if (search && search.trim() !== '') {
      const cleanSearch = search.trim();
      query.$or = [
        { providerName: { $regex: cleanSearch, $options: 'i' } },
        { city: { $regex: cleanSearch, $options: 'i' } },
        { area: { $regex: cleanSearch, $options: 'i' } },
        { notes: { $regex: cleanSearch, $options: 'i' } },
        { 'foodItems.name': { $regex: cleanSearch, $options: 'i' } },
        { 'foodItems.description': { $regex: cleanSearch, $options: 'i' } }
      ];
    }

    const skipIndex = (Number(page) - 1) * Number(limit);
    const totalCount = await Donation.countDocuments(query);

    const donations = await Donation.find(query)
      .populate('donor', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(Number(limit));

    return res.json({
      success: true,
      count: donations.length,
      total: totalCount,
      page: Number(page),
      totalPages: Math.ceil(totalCount / Number(limit)),
      data: donations
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single donation by ID
// @route   GET /api/donations/:id
// @access  Public
export const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email phone')
      .populate('receiverId', 'name email phone address');

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    return res.json({
      success: true,
      data: donation
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in donor's listings
// @route   GET /api/donations/my/list
// @access  Private (Donor only)
export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .populate('donor', 'name email phone')
      .sort({ createdAt: -1 });
      
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

// @desc    Update a food listing
// @route   PUT /api/donations/:id
// @access  Private (Owner donor only)
export const updateDonation = async (req, res) => {
  try {
    let donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    // Verify authorized owner user (must be the donor who created the listing)
    if (donation.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing'
      });
    }

    // Check status values validation
    if (req.body.status && !['available', 'reserved', 'completed'].includes(req.body.status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be available, reserved, or completed.'
      });
    }

    // Update details
    donation = await Donation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.json({
      success: true,
      data: donation
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete food listing
// @route   DELETE /api/donations/:id
// @access  Private (Owner donor only)
export const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    // Verify authorized owner user (must be the donor who created the listing)
    if (donation.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing'
      });
    }

    await Donation.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: 'Listing successfully removed'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
