import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import AddCart from "./pages/AddtoCart/AddCart";
import AddMenu from "./pages/AddMenu/addmenu";
import PlaceOrder from "./pages/order/placeOrder"; 
import AdminOrder from "./pages/AdminOrder/adminOrder";
import OrderStatus from "./pages/OrderStatus/orderStatus";
import UpdatePlaceOrder from "./pages/order/updatePlaceOrder"; 
import { CartProvider } from "./context/CartContext"; 
import Reservation from "./pages/reservation/Reservation";

import ReservationList from "./pages/reservation/reservationList";
import ReservationManagement from "./pages/reservation/ReservationBackground";
import HomePage from "./pages/home/home";

function App() {
  return (
    <CartProvider>
      <Router>
        <div id="wrapper">
          <Header />
          <Routes>
          <Route path="/pages/home/home" element={<HomePage />} />
            <Route path="/" element={<AddMenu />} />
            
            <Route path="/cart" element={<AddCart />} />
            <Route path="/place-order" element={<PlaceOrder />} /> 
            <Route path="/admin-orders" element={<AdminOrder />} /> 
            <Route path="/order-status" element={<OrderStatus />} />
            <Route path="/update-order/:id" element={<UpdatePlaceOrder />} />


            
                    <Route path="/pages/reservation/Reservation" element={<Reservation />} />
                    <Route path="/pages/reservation/ReservationBackground" element={<ReservationManagement />} />
                    <Route path="/pages/reservation/reservationList" element={<ReservationList />} />



          </Routes>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
