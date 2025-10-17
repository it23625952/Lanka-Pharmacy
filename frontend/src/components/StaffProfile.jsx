import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/axios"; // use ../lib/axios if your axios instance is there

const StaffProfile = () => {
  const { id } = useParams(); // get staff ID from URL
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await api.get(`/staff/${id}`);
      setProfile(res.data);
    };
    fetchProfile();
  }, [id]);

  return (
    <div>
      {profile ? (
        <div>
          <h2>{profile.name}</h2>
          <p>Email: {profile.email}</p>
          <p>Role: {profile.role}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default StaffProfile;
