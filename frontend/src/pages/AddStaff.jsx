import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import StaffForm from "../components/StaffForm";

const AddStaff = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      // Ensure role is sent as ID if object
      const payload = { ...data };
     // if (data.role && data.role._id) payload.role = data.role._id;//

      await api.post("/staff", payload);
      navigate("/staff"); // go to staff list on success
    } catch (err) {
      console.error(err);
      alert("Failed to save staff"); // user-friendly message
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add Staff</h2>
      <StaffForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddStaff;
