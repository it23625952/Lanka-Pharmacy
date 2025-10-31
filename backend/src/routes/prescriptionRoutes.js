import express from 'express';
import { 
    deletePrescription, 
    getCustomerPrescriptions, 
    getPrescriptions, 
    rejectPrescription, 
    uploadPrescription, 
    verifyPrescription 
} from '../controllers/prescriptionController.js';
import authenticate from '../middleware/authenticate.js';
import upload from '../config/multer.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// Customer routes - accessible by all authenticated users
router.post('/upload-prescription', authenticate, upload.single('prescriptionImage'), uploadPrescription);
router.get('/customer/my-prescriptions', authenticate, getCustomerPrescriptions);
router.delete('/:prescriptionId', authenticate, deletePrescription);

// Staff routes - require specific role permissions
router.get('/', authenticate, authorize('Owner', 'Manager', 'Staff'), getPrescriptions);
router.put('/:prescriptionId/verify', authenticate, authorize('Owner', 'Manager', 'Staff'), verifyPrescription);
router.put('/:prescriptionId/reject', authenticate, authorize('Owner', 'Manager', 'Staff'), rejectPrescription);

export default router;