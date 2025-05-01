import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (isAdminLogin) => {
    try {
      if (isAdminLogin) {
        // ✅ Hardcoded Admin Login
        const adminEmail = "admin@ceylonflavors.com";
        const adminPassword = "admin123";

        if (email !== adminEmail || password !== adminPassword) {
          setMessage("Invalid admin credentials");
          return;
        }

        const adminUser = { name: "Admin", role: "admin" };

        localStorage.setItem("token", "admin-token");
        localStorage.setItem("user", JSON.stringify(adminUser));
        setUser(adminUser);

        alert("Admin Login Successful!");
        navigate("/admin-dashboard", { replace: true });
      } else {
        // ✅ Normal User Login
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });

        if (res.data.success) {
          const loggedInUser = res.data.user;
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(loggedInUser));
          setUser(loggedInUser);

          alert("Login Successful!");
          window.location.replace("/");
        }
      }
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {message && <p className="text-center text-red-600 mb-4">{message}</p>}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(false);
          }}
        >
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

          <div className="mb-6">
            <label className="block mb-1 text-gray-600">Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-right mb-6">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-blue-500 hover:underline text-sm"
            >
              Forgot Password?
            </button>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => handleLogin(true)}
              className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 mt-4"
            >
              Login as Admin
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-500 hover:underline font-semibold"
            >
              Register
            </button>
          </p>
        </div>

        <div className="text-center mt-6 border-t pt-4">
          <p className="text-gray-600">Are you a delivery person?</p>
          <button
            onClick={() => navigate("/enrolldelivery")}
            className="mt-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
          >
            Enroll as Delivery Person
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
