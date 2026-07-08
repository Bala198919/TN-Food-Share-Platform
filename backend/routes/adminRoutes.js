import express from 'express';
import {
  getAllUsers,
  getAllDonations,
  getAllRequests,
  deleteInappropriateDonation,
  getDashboardStats
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to protect all admin sub-routes
router.use(protect);
router.use(authorize('admin'));

// Fetch registers list
router.get('/users', getAllUsers);
router.get('/donations', getAllDonations);
router.get('/requests', getAllRequests);

// Fetch dashboard stats metrics
router.get('/stats', getDashboardStats);

// Delete inappropriate listings
router.delete('/donations/:id', deleteInappropriateDonation);

export default router;
