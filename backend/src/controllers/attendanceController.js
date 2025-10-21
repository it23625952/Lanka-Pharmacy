// src/controllers/attendanceController.js
import Attendance from "../models/Attendance.js"; // ✅ ES module import
import Staff from "../models/Staff.js"; // optional if you need staff info

export const markAttendance = async (req, res) => {
  try {
    const { staffId, date, status, notes } = req.body;
    const d = date ? new Date(date) : new Date();

    // Upsert one record per staff + date
    const record = await Attendance.findOneAndUpdate(
      { staff: staffId, date: d },
      { staff: staffId, date: d, status, notes },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: "Failed to mark attendance", error: err.message });
  }
};

export const getAttendanceForStaff = async (req, res) => {
  try {
    const records = await Attendance.find({ staff: req.params.staffId }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch attendance", error: err.message });
  }
};

