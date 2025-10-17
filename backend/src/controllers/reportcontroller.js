import Staff from "../models/Staff.js";
import Attendance from "../models/Attendance.js";
import Salary from "../models/Salary.js";

export const getSummary = async (req, res) => {
  try {
    const totalStaff = await Staff.countDocuments();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const presentToday = await Attendance.countDocuments({
      date: { $gte: todayStart, $lte: todayEnd },
      status: "present"
    });

    const absentToday = totalStaff - presentToday;

    const salaries = await Salary.find();
    const totalSalary = salaries.reduce((sum, s) => sum + (s.amount || 0), 0);

    res.json({ totalStaff, presentToday, absentToday, totalSalary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch report summary" });
  }
};
