import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(res.data.users);
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
        navigate("/login");
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${import.meta.env.VITE_API_URL}/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(users.filter((user) => user._id !== id));
        alert("User deleted successfully");
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
      }
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="p-8 min-h-screen bg-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Admin Dashboard</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-6 py-3 text-center">Name</th>
                <th className="border border-gray-300 px-6 py-3 text-center">Email</th>
                <th className="border border-gray-300 px-6 py-3 text-center">Role</th>
                <th className="border border-gray-300 px-6 py-3 text-center">Created At</th>
                <th className="border border-gray-300 px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u._id} className="bg-white hover:bg-gray-50">
                    <td className="border border-gray-300 px-6 py-4 text-center">{u.name}</td>
                    <td className="border border-gray-300 px-6 py-4 text-center">{u.email}</td>
                    <td className="border border-gray-300 px-6 py-4 text-center">{u.role}</td>
                    <td className="border border-gray-300 px-6 py-4 text-center">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="border border-gray-300 px-6 py-4 text-center">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
                        onClick={() => handleDelete(u._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
