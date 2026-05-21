import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", formData);

      alert("Registration Successful");

      navigate("/");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="border p-8 rounded w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Register</h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="border p-2 w-full"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="LPU Email"
          className="border p-2 w-full"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 w-full"
          onChange={handleChange}
        />

        <select
          name="role"
          className="border p-2 w-full"
          onChange={handleChange}
        >
          <option value="student">Student</option>

          <option value="vendor">Vendor</option>

          <option value="admin">Admin</option>
        </select>

        <button className="bg-black text-white p-2 w-full rounded">
          Register
        </button>

        <p className="text-center">
          Already have an account?
          <Link to="/" className="text-blue-500 ml-1">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;