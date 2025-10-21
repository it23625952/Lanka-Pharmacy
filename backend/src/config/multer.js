import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const createUploadDirectories = () => {
    const dirs = [
        'uploads',
        'uploads/products',
        'uploads/prescriptions'
    ];
    
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

createUploadDirectories();

/**
 * Multer disk storage configuration for prescription file uploads.
 * Defines where to store files and how to name them.
 */
const prescriptionStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/prescriptions/'); // Store files in uploads/prescriptions directory
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp and random number to prevent conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'prescription-' + uniqueSuffix + path.extname(file.originalname));
    }
});

/**
 * File filter function to validate uploaded prescription files.
 * Only allows image files to be uploaded.
 */
const prescriptionFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept image files
    } else {
        cb(new Error('Only image files are allowed!'), false); // Reject non-image files
    }
};

/**
 * Multer middleware instance configured for prescription uploads.
 * Handles file storage, filtering, and size limits.
 */
const prescriptionUpload = multer({
    storage: prescriptionStorage,
    fileFilter: prescriptionFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB file size limit
});

/**
 * Multer disk storage configuration for product image uploads.
 * Defines where to store files and how to name them.
 */
const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/products/'); // Store product images in uploads/products directory
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp and random number to prevent conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

/**
 * File filter function to validate uploaded product images.
 * Only allows image files to be uploaded.
 */
const productFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept image files
    } else {
        cb(new Error('Only image files are allowed!'), false); // Reject non-image files
    }
};

/**
 * Multer middleware instance configured for product image uploads.
 * Handles file storage, filtering, and size limits.
 */
const productUpload = multer({
    storage: productStorage,
    fileFilter: productFileFilter,
    limits: { 
        fileSize: 5 * 1024 * 1024 // 5 MB file size limit
    }
});

// Export configurations
export const prescriptionUploadMiddleware = prescriptionUpload.single('prescriptionImage');
export const productUploadMiddleware = productUpload.single('productImage');

// Default export (maintains backward compatibility)
export default prescriptionUpload;