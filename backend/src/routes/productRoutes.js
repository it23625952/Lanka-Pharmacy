import express from "express";
import { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct, 
    uploadProductImage 
} from "../controllers/productController.js";
import authenticate from "../middleware/authenticate.js";
import { productUploadMiddleware } from "../config/multer.js";

const router = express.Router();

// Public routes - accessible without authentication
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected routes - require authentication
router.post("/", authenticate, createProduct);
router.post("/upload-image", authenticate, productUploadMiddleware, uploadProductImage);
router.put("/:id", authenticate, updateProduct);
router.delete("/:id", authenticate, deleteProduct);

export default router;