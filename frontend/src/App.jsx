import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/header";
import AdminHeader from "./components/AdminHeader";
import Footer from "./components/footer";
import { CartProvider } from "./context/CartContext";

// Pages
import AddCart from "./pages/AddtoCart/AddCart";
import AddMenu from "./pages/AddMenu/addmenu";
import Menu from "./pages/menu/Menu";
import MenuTable from "./pages/AddMenuTable/addmenutable";
import UpdateMenu from "./pages/UpdateMenu/updatemenu";
import PlaceOrder from "./pages/order/placeOrder";
import AdminOrder from "./pages/AdminOrder/adminOrder";
import OrderStatus from "./pages/OrderStatus/orderStatus";
import UpdatePlaceOrder from "./pages/order/updatePlaceOrder";
import ReviewForm from "./pages/review/ReviewForm";
import ReviewsPage from "./pages/review/ReviewsPage";
import AdminReviewPage from "./pages/review/AdminReviewPage";
import Reservation from "./pages/reservation/Reservation";
import ReservationList from "./pages/reservation/reservationList";
import ReservationManagement from "./pages/reservation/ReservationBackground";
import HomePage from "./pages/home/home"; 
import Delivery from "./pages/Delivery/delivery";
import UserReservations from "./pages/reservation/UserReservations";


import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Profile from "./pages/auth/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  const location = useLocation();

  const authPaths = ["/login", "/register", "/forgot-password", "/reset-password"];

  const isAuthPage = authPaths.some((path) => location.pathname.startsWith(path));

  return (
    <CartProvider>
      <div id="wrapper" className="flex flex-col min-h-screen">
        {!isAuthPage && <Header />}
        <Routes>

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

          {/* User Pages */}
          <Route path="/" element={<HomePage />} /> 
          <Route path="/menu" element={<Menu />} />
          <Route path="/addmenu" element={<AddMenu />} />
          <Route path="/cart" element={<AddCart />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/order-status" element={<OrderStatus />} />
          <Route path="/update-order/:id" element={<UpdatePlaceOrder />} />
          <Route path="/reviewform" element={<ReviewForm />} />
          <Route path="/reviewspage" element={<ReviewsPage />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/reservation-management" element={<ReservationManagement />} />
          <Route path="/reservation-list" element={<ReservationList />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-reservations" element={<ProtectedRoute><UserReservations /></ProtectedRoute>} />


          {/* Admin Pages */}
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/menutable" element={<ProtectedRoute><MenuTable /></ProtectedRoute>} />
          <Route path="/updatemenu/:id" element={<ProtectedRoute><UpdateMenu /></ProtectedRoute>} />
          <Route path="/admin-orders" element={<ProtectedRoute><AdminOrder /></ProtectedRoute>} />
          <Route path="/adminreviewpage" element={<ProtectedRoute><AdminReviewPage /></ProtectedRoute>} />

        </Routes>
        {!isAuthPage && <Footer />}
      </div>
    </CartProvider>
  );
}

export default App;