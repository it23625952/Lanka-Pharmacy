import express from "express";
import * as attendanceController from "../controllers/attendanceController.js";

const router = express.Router();

router.post('/mark', attendanceController.markAttendance);
router.get('/:staffId', attendanceController.getAttendanceForStaff);

export default router;  // ✅ use default export
