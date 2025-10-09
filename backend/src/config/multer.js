import multer from 'multer';
import path from 'path';

/**
 * Multer disk storage configuration for prescription file uploads.
 * Defines where to store files and how to name them.
 */
const storage = multer.diskStorage({
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
 * File filter function to validate uploaded files.
 * Only allows image files to be uploaded.
 */
const fileFilter = (req, file, cb) => {
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
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB file size limit
});

export default upload;