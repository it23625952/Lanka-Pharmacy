/*import React from "react";

function StaffProfile() {
  return (
    <div>
      <h2>Staff Profile Page</h2>
      <p>Display staff profile details here.</p>
    </div>
  );
}

export default StaffProfile;*/

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/axios";

function StaffProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await api.get(`/staff/${id}`);
        setStaff(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch staff:", err);
        setError("Failed to load staff profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [id]);

  if (loading) return <p className="text-blue-600 text-center mt-10">Loading staff profile...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!staff) return <p className="text-gray-500 text-center mt-10">Staff not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto p-6 border border-blue-200 rounded-2xl shadow-lg bg-white">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">👤 Staff Profile</h2>

        <div className="space-y-3 text-gray-700">
          <p><strong className="text-blue-500">Name:</strong> {staff.name}</p>
          <p><strong className="text-blue-500">Email:</strong> {staff.email}</p>
          <p><strong className="text-blue-500">Phone:</strong> {staff.phone || "N/A"}</p>
          <p><strong className="text-blue-500">Address:</strong> {staff.address || "N/A"}</p>
          <p><strong className="text-blue-500">Role:</strong> {staff.role}</p>
          <p><strong className="text-blue-500">Created At:</strong> {new Date(staff.createdAt).toLocaleString()}</p>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-200"
          >
            ⬅ Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default StaffProfile;
