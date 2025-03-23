import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import AddCart from "./pages/AddtoCart/AddCart";
import AddMenu from "./pages/AddMenu/addmenu";
import Menu from './pages/menu/Menu';
import MenuTable from './pages/AddMenuTable/addmenutable';
import UpdateMenu from './pages/UpdateMenu/updatemenu';
import PlaceOrder from "./pages/order/placeOrder"; 
import AdminOrder from "./pages/AdminOrder/adminOrder";
import OrderStatus from "./pages/OrderStatus/orderStatus";
import UpdatePlaceOrder from "./pages/order/updatePlaceOrder"; 
import ReviewForm from "./pages/review/ReviewForm";
import ReviewsPage from "./pages/review/ReviewsPage";
import AdminReviewPage from './pages/review/AdminReviewPage';
import { CartProvider } from "./context/CartContext"; 
import Reservation from "./pages/reservation/Reservation";
import ReservationList from "./pages/reservation/reservationList";
import ReservationManagement from "./pages/reservation/ReservationBackground";
import HomePage from "./pages/home/home";
import "react-datepicker/dist/react-datepicker.css";


function App() {
  return (
    <CartProvider>
      <Router>
        <div id="wrapper">
          <Header />
          <Routes>


            <Route path="/pages/home/home" element={<HomePage />} />
            <Route path="/" element={<HomePage/>} />

          <Route path="/pages/home/home" element={<HomePage />} />
            <Route path="/" element={<AddMenu />} />
            <Route path="/" element={<Menu />} />

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


            <Route path="/reviewform" element={<ReviewForm />} />
            <Route path="/reviewspage" element={<ReviewsPage />} />
            <Route path="/adminreviewpage" element={<AdminReviewPage />} />

            <Route path="/pages/reservation/Reservation" element={<Reservation />} />
            <Route path="/pages/reservation/ReservationBackground" element={<ReservationManagement />} />
            <Route path="/pages/reservation/reservationList" element={<ReservationList />} />




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
