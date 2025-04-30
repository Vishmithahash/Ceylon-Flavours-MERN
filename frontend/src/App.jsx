import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import { CartProvider } from "./context/CartContext";


// Pages
import AddCart from "./pages/AddtoCart/AddCart";
import AddMenu from "./pages/AddMenu/addmenu";
import Menu from "./pages/admin/Menu";
import MenuTable from "./pages/admin/addmenutable";
import UpdateMenu from "./pages/admin/updatemenu";
import PlaceOrder from "./pages/order/placeOrder";
import AdminOrder from "./pages/admin/adminOrder";
import OrderStatus from "./pages/OrderStatus/orderStatus";
import UpdatePlaceOrder from "./pages/order/updatePlaceOrder";
import ReviewForm from "./pages/review/ReviewForm";
import ReviewsPage from "./pages/review/ReviewsPage";
import AdminReviewPage from "./pages/admin/AdminReviewPage";
import Reservation from "./pages/reservation/Reservation";
import ReservationList from "./pages/admin/reservationList";
import ReservationManagement from "./pages/reservation/ReservationBackground";
import HomePage from "./pages/home/home"; 

import UserReservations from "./pages/reservation/UserReservations";


import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Profile from "./pages/auth/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";


import Deliveries from "./pages/admin/Deliveries";
import ManageDeliveryPersonnel from "./pages/admin/ManageDeliveryPersonnel";
import AddDeliveryPersonnel from "./pages/admin/AssignDelivery";


function App() {
  const location = useLocation();

  const authPaths = ["/login", "/register", "/forgot-password", "/reset-password"];

  const isAuthPage = authPaths.some((path) => location.pathname.startsWith(path));
  

  return (
    <CartProvider>
      <div id="wrapper" className="flex flex-col min-h-screen">
      {!isAuthPage && !location.pathname.startsWith("/admin") && <Header />}

        <Routes>

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

          {/* User Pages */}
          <Route path="/" element={<HomePage />} /> 
          <Route path="/addmenu" element={<AddMenu />} />
          <Route path="/cart" element={<AddCart />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/order-status" element={<OrderStatus />} />
          <Route path="/update-order/:id" element={<UpdatePlaceOrder />} />
          <Route path="/reviewform" element={<ReviewForm />} />
          <Route path="/reviewspage" element={<ReviewsPage />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/reservation-management" element={<ReservationManagement />} />
        
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-reservations" element={<ProtectedRoute><UserReservations /></ProtectedRoute>} />


          {/* Admin Pages with AdminLayout */}
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/addmenutable" element={<ProtectedRoute><AdminLayout><MenuTable /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/menu" element={<ProtectedRoute><AdminLayout><Menu /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/updatemenu/:id" element={<ProtectedRoute><AdminLayout><UpdateMenu /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/admin-orders" element={<ProtectedRoute><AdminLayout><AdminOrder /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/adminreviewpage" element={<ProtectedRoute><AdminLayout><AdminReviewPage /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/reservation-list" element={<ProtectedRoute><AdminLayout><ReservationList /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/delivery" element={<ProtectedRoute><AdminLayout><Deliveries /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/manage-delivery-personnel" element={<ProtectedRoute><AdminLayout><ManageDeliveryPersonnel /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/add-delivery-personnel" element={<ProtectedRoute><AdminLayout><AddDeliveryPersonnel /></AdminLayout></ProtectedRoute>} />



          {/* 404 Page */}


        </Routes>
        {!isAuthPage && <Footer />}
      </div>
    </CartProvider>
  );
}

export default App;