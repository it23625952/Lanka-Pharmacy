import User from "../models/User.js";
import bcrypt from "bcryptjs";

// ✅ Create Staff
export const createStaff = async (req, res) => {
  try {
    const { name, email, phone, address, password, datebirth, role } = req.body;

    if (!name || !email || !password || !address) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = new User({
      name,
      email,
      phone,
      address,
      role: role || "Staff",  // default role
      password: hashedPassword,
      dateOfBirth: datebirth ? new Date(datebirth) : null,
    });

    await staff.save();
    res.status(201).json(staff);
  } catch (err) {
    console.error("❌ Error creating staff:", err);
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Failed to create staff", error: err.message });
  }
};

// ✅ List all staff (include all your roles)
export const listStaff = async (req, res) => {
  try {
    const staffs = await User.find({
      role: { $in: ["Owner", "Manager", "Staff", "Wholesale", "Customer", "Retail Customer"] }
    }).sort({ createdAt: -1 });

    res.json(staffs);
  } catch (err) {
    res.status(500).json({ message: "Failed to list staff", error: err.message });
  }
};

// ✅ Assign/change role
export const assignRole = async (req, res) => {
  try {
    const { role } = req.body;
    const staff = await User.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    staff.role = role;
    await staff.save();

    res.json({ message: "Role updated", staff });
  } catch (err) {
    res.status(500).json({ message: "Failed to update role", error: err.message });
  }
};

// Get single staff by ID
export const getStaff = async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: "Error fetching staff", error: err.message });
  }
};

// Update staff
export const updateStaff = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Staff not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update staff", error: err.message });
  }
};

// Delete staff
export const deleteStaff = async (req, res) => {
  try {
    const removed = await User.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Staff not found" });
    res.json({ message: "Staff deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete staff", error: err.message });
  }
};
