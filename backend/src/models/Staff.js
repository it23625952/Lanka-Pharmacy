// src/models/staff.js
import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  role: {
    type: String,
    enum: ["Owner", "Manager", "Staff", "Wholesale", "Customer", "Retail Customer"],
    required: true,
  },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Prevent redeclaring the model
const Staff = mongoose.models.Staff || mongoose.model("Staff", StaffSchema);

export default Staff;
