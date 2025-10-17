/*import React from "react";

const Dashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <p className="mt-4">Welcome to the Staff Management Dashboard!</p>
    </div>
  );
};

export default Dashboard;
*/

import React, { useEffect, useState } from "react";
import api from "../lib/axios";

// ✅ Reports Component
const Reports = ({ refreshTrigger }) => {
  const [report, setReport] = useState(null);

  const fetchReport = async () => {
    try {
      const res = await api.get("/reports/summary");
      setReport(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [refreshTrigger]);

  if (!report) return <p className="text-gray-700">Loading report...</p>;

  return (
    <div className="p-6 mt-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">📊 Reports</h2>
      <div className="space-y-2 text-gray-700">
        <p><b>Total Staff:</b> {report.totalStaff}</p>
        <p><b>Present Today:</b> {report.presentToday}</p>
        <p><b>Absent Today:</b> {report.absentToday}</p>
        <p><b>Total Salary:</b> Rs. {report.totalSalary}</p>
      </div>
    </div>
  );
};

// ✅ Main Dashboard
const Dashboard = () => {
  const [staffList, setStaffList] = useState([]);
  const [rolesCount, setRolesCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await api.get("/staff");
        setStaffList(res.data);

        // Count by role
        const roleCounts = res.data.reduce((acc, staff) => {
          acc[staff.role] = (acc[staff.role] || 0) + 1;
          return acc;
        }, {});
        setRolesCount(roleCounts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
          🧑‍💼 Staff Dashboard
        </h2>

        {/* Staff Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200">
            <h3 className="font-semibold text-gray-700">Total Staff</h3>
            <p className="text-3xl font-bold text-blue-600">{staffList.length}</p>
          </div>
          {Object.keys(rolesCount).map(role => (
            <div
              key={role}
              className="p-6 bg-green-50 rounded-2xl shadow-md border border-green-200"
            >
              <h3 className="font-semibold text-gray-700">{role}</h3>
              <p className="text-3xl font-bold text-green-600">{rolesCount[role]}</p>
            </div>
          ))}
        </div>

        {/* Reports Section */}
        <Reports refreshTrigger={refresh} />
      </div>
    </div>
  );
};

export default Dashboard;
