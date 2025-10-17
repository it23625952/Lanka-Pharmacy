import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Calendar, 
  DollarSign, 
  BarChart3,
  FileText 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation(); // current route

  const menuItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/staff", icon: Users, label: "Staff" },
    { to: "/roles", icon: Shield, label: "Roles" },
    { to: "/attendance", icon: Calendar, label: "Attendance" },
    { to: "/salary", icon: DollarSign, label: "Salary" },
    { to: "/reports", icon: BarChart3, label: "Reports" },
  ];

  return (
    <div className="fixed top-0 left-0 w-80 h-screen bg-gradient-to-b from-emerald-700 to-emerald-800 shadow-2xl p-8 space-y-6 text-white border-r-2 border-emerald-600 z-50">
      {/* Header */}
      <div className="pb-6 border-b-2 border-emerald-500/30">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
            <FileText className="size-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
            Admin Panel
          </h2>
        </div>
        <p className="text-emerald-100 text-sm pl-16">Management Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-3">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group border-2 ${
                isActive ? "bg-white/20 border-white/40" : "border-transparent hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <div className={`bg-white/20 backdrop-blur-sm p-2 rounded-xl transition-all duration-300 group-hover:bg-white/30 ${isActive ? "bg-white/30" : ""}`}>
                <IconComponent className="size-5 text-white" />
              </div>
              <span className={`font-semibold text-lg transition-colors duration-300 ${isActive ? "text-white/90" : "group-hover:text-white/90"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;

