import React, { useEffect, useState } from "react";
import api from "../lib/axios";

const Roles = () => {
  const [staff, setStaff] = useState([]);
  const [roles, setRoles] = useState([
    { name: "Owner" },
    { name: "Manager" },
    { name: "Staff" },
    { name: "Wholesale" },
    { name: "Customer" },
    { name: "Retail Customer" },
  ]);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await api.get("/staff");
      const uniqueStaff = Array.from(
        new Map(res.data.map((s) => [s._id, s])).values()
      );
      setStaff(uniqueStaff);
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  const assignRole = async (staffId, roleName) => {
    try {
      setStaff((prev) =>
        prev.map((s) => (s._id === staffId ? { ...s, role: roleName } : s))
      );
      await api.put(`/staff/${staffId}/role`, { role: roleName });
    } catch (err) {
      console.error("Error assigning role:", err);
      fetchStaff();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-green-200">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          🌿 Assign / View Roles
        </h2>

        <table className="w-full border border-green-200 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-green-100 text-green-800">
            <tr>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Current Role</th>
              <th className="border p-3 text-left">Change Role</th>
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
                  {s.role || "No Role Assigned"}
                </td>
                <td className="border p-3">
                  <select
                    className="border border-green-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={s.role || ""}
                    onChange={(e) => assignRole(s._id, e.target.value)}
                  >
                    <option value="">-- Select Role --</option>
                    {roles.map((r) => (
                      <option key={r.name} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Roles;
