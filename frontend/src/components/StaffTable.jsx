import React from "react";
import { Link } from "react-router-dom";

const StaffTable = ({ staff, onDelete }) => {
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">Name</th>
          <th className="border p-2">Email</th>
          <th className="border p-2">Phone</th>
          <th className="border p-2">Role</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {staff.map((s) => (
          <tr key={s._id} className="hover:bg-gray-50">
            <td className="border p-2">{s.name}</td>
            <td className="border p-2">{s.email}</td>
            <td className="border p-2">{s.phone}</td>
            <td className="border p-2">{s.role?.name || "—"}</td>
            <td className="border p-2 space-x-2">
              <Link to={`/staff/${s._id}`} className="text-blue-600">View</Link>
              <Link to={`/staff/edit/${s._id}`} className="text-green-600">Edit</Link>
              <button onClick={() => onDelete(s._id)} className="text-red-600">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StaffTable;
