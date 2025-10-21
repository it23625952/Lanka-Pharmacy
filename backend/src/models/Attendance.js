// src/models/Attendance.js
import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["present","absent","off","late"], default: "present" },
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

AttendanceSchema.index({ staff: 1, date: 1 }, { unique: true }); // one record per staff per date

// ✅ Prevent redeclaring the model
const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);

export default Attendance;
