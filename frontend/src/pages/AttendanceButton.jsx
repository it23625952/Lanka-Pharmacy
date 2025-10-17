import React from "react";
import api from "../lib/axios";

const AttendanceButton = ({ staffId, onMarked }) => {
  const handlePresent = async () => {
    try {
      await api.post("/attendance/mark", { staffId, status: "Present" });
      alert("Attendance marked!");
      onMarked(); // trigger report refresh
    } catch (err) {
      console.error(err);
      alert("Failed to mark attendance");
    }
  };

  return (
    <button
      onClick={handlePresent}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Mark Present
    </button>
  );
};

export default AttendanceButton;
