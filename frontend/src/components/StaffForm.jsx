import React, { useState } from "react";
import api from "../lib/axios";

const StaffForm = ({ initialData = {}, onSubmit = () => {} }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    address: initialData.address || "",
    password: "",
    datebirth:"",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password) {
      alert("Please enter a password");
      return;
    }

    try {
      const res = await api.post("/staff", formData);
      alert("✅ Staff saved successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
      });
    } catch (err) {
      console.error("Error saving staff:", err);
      if (err.response?.data?.message) {
        alert("❌ " + err.response.data.message);
      } else {
        alert("❌ Failed to save staff. Check backend connection.");
      }
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

 
      <button
        type="submit"
        className="bg-teal-600 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </form>
  );
};

export default StaffForm;
