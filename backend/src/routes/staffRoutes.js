import express from "express";
import * as staffController from "../controllers/staffController.js";

const router = express.Router();

router.post("/", staffController.createStaff);
router.get("/", staffController.listStaff);
router.get("/:id", staffController.getStaff);
router.put("/:id", staffController.updateStaff);
router.delete("/:id", staffController.deleteStaff);
// assign/change role
router.put("/:id/role", staffController.assignRole);


export default router;  // ✅ default export
