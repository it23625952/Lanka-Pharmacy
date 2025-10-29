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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Users, UserCheck, UserX, DollarSign, Calendar, TrendingUp } from 'lucide-react';

const Reports = ({ refreshTrigger }) => {
  const [report, setReport] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/reports/summary");
      setReport(res.data);

      // Example: if your API sends attendance stats per day
      // Replace this with your actual API field (e.g., res.data.attendanceStats)
      const data = res.data.attendanceStats || [
        { date: "2025-10-01", present: 45, absent: 5 },
        { date: "2025-10-02", present: 42, absent: 8 },
        { date: "2025-10-03", present: 47, absent: 3 },
        { date: "2025-10-04", present: 44, absent: 6 },
        { date: "2025-10-05", present: 46, absent: 4 },
      ];
      setAttendanceData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="size-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No Report Data</h3>
          <p className="text-gray-600">Unable to load attendance report. Please try again.</p>
        </div>
      </div>
    );
  }

  // Format dates for better display
  const formattedAttendanceData = attendanceData.map(item => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwNTk2NjkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDJ2MmgtMnptMCA0aDJ2MmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-4">
            Staff Analytics
          </h1>
          <p className="text-gray-600 text-xl">Comprehensive staff attendance and payroll overview</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Staff Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">Total Staff</p>
                <p className="text-3xl font-bold text-gray-800">{report.totalStaff}</p>
                <p className="text-xs text-gray-500 mt-1">Team members</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Users className="size-6 text-white" />
              </div>
            </div>
          </div>

          {/* Present Today Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">Present Today</p>
                <p className="text-3xl font-bold text-emerald-600">{report.presentToday}</p>
                <p className="text-xs text-gray-500 mt-1">Currently working</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <UserCheck className="size-6 text-white" />
              </div>
            </div>
          </div>

          {/* Absent Today Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">Absent Today</p>
                <p className="text-3xl font-bold text-amber-600">{report.absentToday}</p>
                <p className="text-xs text-gray-500 mt-1">On leave</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
                <UserX className="size-6 text-white" />
              </div>
            </div>
          </div>

          {/* Total Salary Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">Total Salary</p>
                <p className="text-3xl font-bold text-purple-600">Rs. {report.totalSalary?.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Monthly payroll</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <DollarSign className="size-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Chart Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-8">
          {/* Chart Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <TrendingUp className="size-8 text-emerald-600" />
                Attendance Overview
              </h2>
              <p className="text-gray-600 text-lg mt-2">Daily present vs absent staff members</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2">
              <Calendar className="size-5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Last 5 Days</span>
            </div>
          </div>

          {/* Chart Container */}
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={formattedAttendanceData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="formattedDate"
                  stroke="#6b7280"
                  fontSize={12}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value) => [`${value} staff`, ""]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  wrapperStyle={{
                    paddingBottom: "20px"
                  }}
                />
                <Bar 
                  dataKey="present" 
                  fill="#10b981" 
                  name="Present Staff"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="absent" 
                  fill="#f59e0b" 
                  name="Absent Staff"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
              <p>📊 Real-time staff attendance monitoring</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                  <span>Present Staff</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded"></div>
                  <span>Absent Staff</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Attendance Rate Card */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl shadow-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Attendance Rate</h3>
                <p className="text-3xl font-bold">
                  {Math.round((report.presentToday / report.totalStaff) * 100)}%
                </p>
                <p className="text-emerald-100 text-sm mt-2">
                  {report.presentToday} out of {report.totalStaff} staff present today
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <UserCheck className="size-8 text-white" />
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Absence Rate</span>
                <span className="font-semibold text-amber-600">
                  {Math.round((report.absentToday / report.totalStaff) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Average Daily Present</span>
                <span className="font-semibold text-emerald-600">
                  {Math.round(formattedAttendanceData.reduce((acc, day) => acc + day.present, 0) / formattedAttendanceData.length)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Data Period</span>
                <span className="font-semibold text-gray-800">{formattedAttendanceData.length} days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;