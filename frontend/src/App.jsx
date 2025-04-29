import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
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
import { CartProvider } from "./context/CartContext"; 
import Reservation from "./pages/reservation/Reservation";
import ReservationList from "./pages/reservation/reservationList";
import ReservationManagement from "./pages/reservation/ReservationBackground";
import HomePage from "./pages/home/home";
import Delivery from "./pages/Delivery/delivery";
import AdminDashboard from "./pages/AdminsDashboard/AdminDashboard";
import "react-datepicker/dist/react-datepicker.css";

// New Component to use location detection
function AppContent() {
  const location = useLocation();

  // Admin pages where Header/Footer should be hidden
  const hideHeaderFooterRoutes = [
    "/admin/dashboard",
    "/admin/orders",
    "/admin/deliveries",
    "/admin/reservations",
    "/admin/reviews",
    "/admin/inventory",
    "/reservation-list"   // added!
];

  const shouldHideHeaderFooter = hideHeaderFooterRoutes.includes(location.pathname);

  return (
    <div id="wrapper">
      {/* Only show Header and Footer if not on admin pages */}
      {!shouldHideHeaderFooter && <Header />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/addmenu" element={<AddMenu />} />
        <Route path="/menutable" element={<MenuTable />} />
        <Route path="/updatemenu/:id" element={<UpdateMenu />} />
        <Route path="/cart" element={<AddCart />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/admin-orders" element={<AdminOrder />} />
        <Route path="/order-status" element={<OrderStatus />} />
        <Route path="/update-order/:id" element={<UpdatePlaceOrder />} />
        <Route path="/reviewform" element={<ReviewForm />} />
        <Route path="/reviewspage" element={<ReviewsPage />} />
        <Route path="/adminreviewpage" element={<AdminReviewPage />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/reservation-management" element={<ReservationManagement />} />
        

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/reservation-list" element={<ReservationList />} />
        {/* (You can add more admin-specific pages here later) */}
      </Routes>

      {!shouldHideHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;
