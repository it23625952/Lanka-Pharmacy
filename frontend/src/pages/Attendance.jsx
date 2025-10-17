/*import React from "react";

function Attendance() {
  return (
    <div>
      <h2>Attendance Page</h2>
      <p>This is the Attendance management page.</p>
    </div>
  );
}

export default Attendance;
*/
import React, { useEffect, useState } from "react";
import api from "../lib/axios";

function Attendance() {
  const [staffList, setStaffList] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Fetch staff list
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await api.get("/staff");
        setStaffList(res.data);
      } catch (err) {
        console.error("Failed to fetch staff", err);
        alert("❌ Failed to fetch staff list.");
      }
    };
    fetchStaff();
  }, []);

  // Auto-save attendance on toggle
  const handleToggle = async (id) => {
    const newStatus = !attendance[id]; // toggle value
    setAttendance((prev) => ({
      ...prev,
      [id]: newStatus,
    }));

    try {
      await api.post("/attendance/mark", {
        staffId: id,
        date,
        status: newStatus ? "Present" : "Absent",
      });
      console.log(`✅ Attendance for ${id} saved`);
    } catch (err) {
      console.error("Error auto-saving attendance:", err);
      alert("❌ Failed to save attendance");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-green-200">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
          🌿 Attendance Management
        </h2>

        <div className="mb-6 text-center">
          <label className="mr-3 font-semibold text-green-800">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <table className="w-full border border-green-200 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-green-100 text-green-800">
            <tr>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-center">Mark Attendance</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff, index) => (
              <tr
                key={staff._id}
                className={`${index % 2 === 0 ? "bg-white" : "bg-green-50"} hover:bg-green-100 transition`}
              >
                <td className="border p-3">{staff.name}</td>
                <td className="border p-3">{staff.email}</td>
                <td className="border p-3 text-center">
                  <button
                    onClick={() => handleToggle(staff._id)}
                    className={`px-4 py-2 rounded-lg font-semibold shadow-sm transition ${
                      attendance[staff._id]
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    {attendance[staff._id] ? "Present" : "Absent"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Attendance;

