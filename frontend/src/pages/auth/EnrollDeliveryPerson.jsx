import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function EnrollDeliveryPerson() {
  const navigate = useNavigate();
  const [enrollCode, setEnrollCode] = useState("");

  const handleEnroll = () => {
    if (enrollCode === "123456") { // ✅ Your predefined valid code
      alert("✅ Enrollment successful!");
      navigate("/delivery-person");
    } else {
      alert("❌ Invalid code. Please enter the correct 6-digit enrollment code.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-200 to-yellow-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-96 text-center">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6">Delivery Enrollment</h2>

        <label className="block mb-2 text-gray-700 font-semibold">Enter 6-digit Enrollment Code</label>
        <input
          type="text"
          value={enrollCode}
          maxLength={6}
          onChange={(e) => setEnrollCode(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 mb-4 rounded-lg text-center text-lg"
          placeholder="Enter your code"
        />

        <button
          onClick={handleEnroll}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
}

export default EnrollDeliveryPerson;
