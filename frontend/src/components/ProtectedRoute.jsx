import { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (token && storedUser) {
      if (!user) {
        setUser(storedUser); // ✅ Restore user if page refreshed
      }

      // ✅ Block going back to login page
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = () => {
        window.history.go(1); // ❗ User cannot click back to login
      };
    } else {
      navigate("/login", { replace: true });
    }
  }, [user, setUser, navigate]);

  // If user not available yet, don't render children
  if (!user) {
    return null; // Or show loading spinner if you want
  }

  return children;
};

export default ProtectedRoute;
