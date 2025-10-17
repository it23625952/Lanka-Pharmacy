// src/routes/salaryRoutes.js
import express from "express";
import * as salaryController from "../controllers/salaryController.js";

const router = express.Router();

router.post("/", salaryController.createSalary);
router.get("/:staffId", salaryController.getSalaryByStaff);
router.put("/:id", salaryController.updateSalary);
router.delete("/:id", salaryController.deleteSalary);

export default router;  // ✅ default export
