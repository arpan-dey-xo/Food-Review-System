import { useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const changePassword = async (e) => {
    e.preventDefault();

    try {
      await API.put(
        "/auth/change-password",

        formData,

        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        },
      );

      alert("Password Changed Successfully");

      setFormData({
        oldPassword: "",
        newPassword: "",
      });
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <p className="mt-2">Welcome {user?.name}</p>

          <p>Role: {user?.role}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Change Password
          </button>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mt-10 flex gap-4">
        <button
          onClick={() => navigate("/foods")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          View Foods
        </button>
        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Admin Panel
          </button>
        )}
      </div>

      {showPasswordForm && (
        <form
          onSubmit={changePassword}
          className="border p-6 rounded mt-10 w-96 space-y-4"
        >
          <h2 className="text-2xl font-bold">Change Password</h2>

          <input
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            value={formData.oldPassword}
            onChange={handleChange}
            className="border p-2 w-full"
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            className="border p-2 w-full"
          />

          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Change Password
          </button>
        </form>
      )}
    </div>
  );
}

export default Dashboard;