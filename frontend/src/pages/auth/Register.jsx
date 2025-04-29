import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");    // <-- New
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null); // <-- New
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("mobile", mobile);    // <-- New
      formData.append("password", password);
      formData.append("profileImage", profileImage); // <-- New

      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      alert("Registration failed!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        {/* 📱 Mobile Number */}
        <input
          type="tel"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        {/* 🖼️ Profile Image */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfileImage(e.target.files[0])}
          required
          className="w-full"
        />

        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded w-full">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
