import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EnrollDeliveryPerson() {
  const navigate = useNavigate();
  const [enrollCode, setEnrollCode] = useState("");

  const handleEnroll = async () => {
    if (enrollCode.length !== 6) {
      alert("❌ Code must be 6 digits.");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/delivery");
      const matched = res.data.find((p) => p.EnrollmentCode === enrollCode);

      if (!matched) {
        alert("❌ No delivery person found for this code.");
        return;
      }

      localStorage.setItem("deliveryPersonId", matched.DeliveryPersonID);
      alert(`✅ Welcome ${matched.DeliveryPersonName}`);
      navigate("/delivery-person");
    } catch (err) {
      console.error(err);
      alert("❌ Enrollment failed.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-200 to-yellow-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-96 text-center">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6">Delivery Enrollment</h2>

        <label className="block mb-2 text-gray-700 font-semibold">Enter Your Enrollment Code</label>
        <input
          type="text"
          maxLength={6}
          value={enrollCode}
          onChange={(e) => setEnrollCode(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 mb-4 rounded-lg text-center text-lg"
          placeholder="123456"
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
