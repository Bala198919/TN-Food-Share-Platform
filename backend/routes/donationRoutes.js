import express from 'express';
import {
  createDonation,
  getDonations,
  getDonationById,
  getMyDonations,
  updateDonation,
  deleteDonation
} from '../controllers/donationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get public listings with filters (Public)
router.get('/', getDonations);

// Get logged-in donor's own listings (Private - Donor only)
// NOTE: This must be defined before GET /:id so it is not treated as a parameter ID
router.get('/my/list', protect, authorize('donor'), getMyDonations);

// Get single listing details (Public)
router.get('/:id', getDonationById);

// Create excess food listing (Private - Donor only)
router.post('/', protect, authorize('donor'), createDonation);

// Update food listing details (Private - Owner Donor only)
router.put('/:id', protect, authorize('donor'), updateDonation);

// Delete food listing (Private - Owner Donor only)
router.delete('/:id', protect, authorize('donor'), deleteDonation);

export default router;
