import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import StaffForm from "../components/StaffForm";

const EditStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);

  useEffect(() => {
    api.get(`/staff/${id}`).then((res) => setStaff(res.data));
  }, [id]);

  const handleSubmit = async (data) => {
    await api.put(`/staff/${id}`, data);
    navigate("/staff");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Edit Staff</h2>
      {staff && <StaffForm initialData={staff} onSubmit={handleSubmit} />}
    </div>
  );
};

export default EditStaff;