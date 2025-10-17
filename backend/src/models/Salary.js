// src/models/Salary.js
import mongoose from "mongoose";

const SalarySchema = new mongoose.Schema({
  staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true }, // e.g. '2025-09'
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

// Prevent redeclaration
const Salary = mongoose.models.Salary || mongoose.model("Salary", SalarySchema);

export default Salary;  // ✅ default export for ES modules
