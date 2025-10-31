import React, { useEffect, useState } from "react";
import api from "../lib/axios";

const Salary = () => {
  const [staff, setStaff] = useState([]);
  const [salaries, setSalaries] = useState({});

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await api.get("/staff");
      setStaff(res.data);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
      alert("❌ Failed to load staff list");
    }
  };

  const updateSalary = async (staffId, amount) => {
    try {
      const month = new Date().toISOString().slice(0, 7); // e.g. "2025-10"
      await api.post("/salary", { staff: staffId, amount, month });
      setSalaries((prev) => ({ ...prev, [staffId]: amount }));
      alert("✅ Salary updated successfully!");
    } catch (err) {
      console.error("Error updating salary:", err);
      alert("❌ Failed to update salary");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-green-200">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
          💰 Manage Salary
        </h2>

        <table className="w-full border border-green-200 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-green-100 text-green-800">
            <tr>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Salary</th>
              <th className="border p-3 text-left">Update</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s, index) => (
              <tr
                key={s._id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-green-50"
                } hover:bg-green-100 transition`}
              >
                <td className="border p-3">{s.name}</td>
                <td className="border p-3 text-green-700 font-medium">
                  {salaries[s._id] || s.salary || "Not set"}
                </td>
                <td className="border p-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Enter salary"
                      className="border border-green-300 rounded-lg px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-green-400"
                      onChange={(e) =>
                        setSalaries((prev) => ({
                          ...prev,
                          [s._id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
                      onClick={() => updateSalary(s._id, salaries[s._id])}
                    >
                      Save
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Salary;
