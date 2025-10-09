import express from 'express';
import { getCustomerPrescriptions, getPrescriptions, rejectPrescription, uploadPrescription, verifyPrescription } from '../controllers/prescriptionController.js';
import authenticate from '../middleware/authenticate.js';
import upload from '../config/multer.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// Customer routes - accessible by all authenticated users
router.post('/upload-prescription', authenticate, upload.single('prescriptionImage'), uploadPrescription); // Upload prescription with image
router.get('/customer/my-prescriptions', authenticate, getCustomerPrescriptions); // Get customer's own prescriptions

// Staff routes - require specific role permissions
router.get('/', authenticate, authorize('Owner', 'Manager', 'Staff'), getPrescriptions); // Get all prescriptions (staff only)
router.put('/:prescriptionId/verify', authenticate, authorize('Owner', 'Manager', 'Staff'), verifyPrescription); // Verify prescription (staff only)
router.put('/:prescriptionId/reject', authenticate, authorize('Owner', 'Manager', 'Staff'), rejectPrescription); // Reject prescription (staff only)

export default router;