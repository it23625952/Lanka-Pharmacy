import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../lib/axios";

const StaffList = () => {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    api.get("/staff").then((res) => setStaff(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      await api.delete(`/staff/${id}`);
      setStaff(staff.filter((s) => s._id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-green-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-700">🌿 Staff List</h2>
          <Link
            to="/staff/add"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition duration-200"
          >
            ➕ Add Staff
          </Link>
        </div>

        <table className="min-w-full border border-green-200 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-green-100 text-green-800">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Role</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s, index) => (
              <tr
                key={s._id}
                className={`text-center ${
                  index % 2 === 0 ? "bg-white" : "bg-green-50"
                } hover:bg-green-100 transition`}
              >
                <td className="p-3 border">{s.name}</td>
                <td className="p-3 border">{s.email}</td>
                <td className="p-3 border">{s.phone || "N/A"}</td>
                <td className="p-3 border">{s.role}</td>
                <td className="p-3 border space-x-2">
                  <Link
                    to={`/staff/${s._id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow"
                  >
                    View
                  </Link>
                  <Link
                    to={`/staff/edit/${s._id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded shadow"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffList;