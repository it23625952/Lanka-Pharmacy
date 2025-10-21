// src/controllers/salaryController.js
import Salary from "../models/Salary.js";

export const createSalary = async (req, res) => {
  try {
    const s = new Salary(req.body);
    await s.save();
    res.status(201).json(s);
  } catch (err) {
    res.status(500).json({ message: "Failed to create salary record", error: err.message });
  }
};

export const getSalaryByStaff = async (req, res) => {
  try {
    const records = await Salary.find({ staff: req.params.staffId }).sort({ month: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch salary history", error: err.message });
  }
};

export const updateSalary = async (req, res) => {
  try {
    const updated = await Salary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update salary", error: err.message });
  }
};

export const deleteSalary = async (req, res) => {
  try {
    await Salary.findByIdAndDelete(req.params.id);
    res.json({ message: "Salary record deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete salary", error: err.message });
  }
};
