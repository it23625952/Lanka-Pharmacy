import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Cloudinary storage configuration for prescription file uploads
 */
const prescriptionStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'prescriptions',
    format: async (req, file) => {
      // Preserve original format or convert to webp for images
      const ext = path.extname(file.originalname).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
        return 'webp'; // Convert images to webp for better compression
      }
      return ext.substring(1); // Remove the dot for other formats
    },
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return 'prescription-' + uniqueSuffix;
    },
    transformation: [
      { width: 1200, height: 1200, crop: 'limit', quality: 'auto' }
    ]
  },
});

/**
 * Cloudinary storage configuration for product image uploads
 */
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
    format: async (req, file) => 'webp',
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return 'product-' + uniqueSuffix;
    },
    transformation: [
      { width: 800, height: 800, crop: 'limit', quality: 'auto' }
    ]
  },
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
 * Multer middleware instance configured for prescription uploads.
 * Handles file storage, filtering, and size limits.
 */
const prescriptionUpload = multer({
  storage: prescriptionStorage,
  fileFilter: prescriptionFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB file size limit
});

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