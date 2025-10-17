import React, { useEffect, useState } from "react";
import api from "../lib/axios";

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
  }, [refreshTrigger]); // re-fetch when refreshTrigger changes

  if (!report)
    return (
      <p className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
        Loading report...
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          📊 Reports Summary
        </h2>
        <div className="space-y-3 text-gray-700">
          <p>
            <b>Total Staff:</b> {report.totalStaff}
          </p>
          <p>
            <b>Present Today:</b> {report.presentToday}
          </p>
          <p>
            <b>Absent Today:</b> {report.absentToday}
          </p>
          <p>
            <b>Total Salary:</b> Rs. {report.totalSalary}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
