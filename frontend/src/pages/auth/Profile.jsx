import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setName(res.data.user.name);
        setEmail(res.data.user.email);
        setMobile(res.data.user.mobile || "");
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("mobile", mobile);
      if (password) {
        formData.append("password", password);
      }
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        setUser(res.data.user);
        setMessage("Profile updated successfully!");
        setPassword("");
      }
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      setMessage(error.response?.data?.message || "Update failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6">
      
      {/* Navigation buttons OUTSIDE the form */}
      <div className="flex gap-6 mb-8">
        <button
          onClick={() => navigate("/order-status")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold"
        >
          My Orders
        </button>
        <button
          onClick={() => navigate("/my-reservations")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold"
        >
          Reservations
        </button>
        <button
          onClick={() => navigate("/delivery")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold"
        >
          Deliveries
        </button>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>
        {message && <p className="text-center text-green-600 mb-4">{message}</p>}
        <form onSubmit={handleUpdateProfile}>
          <div className="mb-4">
            <label className="block mb-1 text-gray-600">Name</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-600">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-600">Mobile</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-lg"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 text-gray-600">New Password (optional)</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep old password"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 text-gray-600">Profile Image</label>
            <input
              type="file"
              className="w-full"
              onChange={(e) => setProfileImage(e.target.files[0])}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
          >
            Update Profile
          </button>
        </form>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 mt-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
