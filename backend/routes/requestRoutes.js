import express from 'express';
import {
  createRequest,
  getMyRequests,
  manageRequest,
  cancelRequest
} from '../controllers/requestController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get active user requests (Private)
// NOTE: Must be defined before PUT/DELETE /:id so it is not treated as a parameter ID
router.get('/my', protect, getMyRequests);

// Create request for surplus food listing (Private - Receiver only)
router.post('/', protect, authorize('receiver'), createRequest);

// Manage request - Accept/Reject (Private - Donor only)
router.put('/:id', protect, authorize('donor'), manageRequest);

// Cancel pending request (Private - Receiver only)
router.delete('/:id', protect, authorize('receiver'), cancelRequest);

export default router;
