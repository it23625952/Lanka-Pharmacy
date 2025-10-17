import React, { useState } from "react";
import api from "../lib/axios";

const Attendance = ({ staffId }) => {
  const [message, setMessage] = useState("");

  const markAttendance = async () => {
    try {
      await api.post("/attendance/mark", { staffId }); // match backend
      setMessage("Attendance marked successfully");
    } catch (err) {
      console.error(err);
      setMessage("Error marking attendance");
    }
  };

  return (
    <div>
      <button onClick={markAttendance}>Mark Attendance</button>
      <p>{message}</p>
    </div>
  );
};

export default Attendance;
