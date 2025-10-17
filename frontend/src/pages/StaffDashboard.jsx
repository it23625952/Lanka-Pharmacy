import React from "react";
import StaffProfile from "../components/StaffProfile";
import Attendance from "../components/Attendance";

const StaffDashboard = ({ staffId }) => {
  return (
    <div>
      <h1>Staff Dashboard</h1>
      <StaffProfile staffId={staffId} />
      <Attendance staffId={staffId} />
    </div>
  );
};

export default StaffDashboard;
