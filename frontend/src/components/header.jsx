import React from 'react'
import {BrowserRouter, Routes, Route}from 'react-router-dom'

function Header() {
  return (
    <div id ="navcontent">
        
        <header className="bg-[#361a1d] text-white p-4 shadow-lg ">
  <div className="container mx-auto flex justify-between items-center">
    {/* Logo */}
    <h1 className="text-2xl font-extrabold tracking-wide">Ceylon Flavors</h1>
    
    {/* Navigation */}
    <nav>
      <ul className="flex space-x-6 text-lg">
        <li><a href="/pages/home/home" className="relative transition-all duration-300 ease-in-out hover:text-yellow-300 after:block after:content-[''] after:w-0 after:h-[3px] after:bg-yellow-300 after:transition-all after:duration-300 after:ease-in-out after:hover:w-full">Home</a></li>
        <li><a href="/pages/AddMenu/addmenu" className="relative transition-all duration-300 ease-in-out hover:text-yellow-300 after:block after:content-[''] after:w-0 after:h-[3px] after:bg-yellow-300 after:transition-all after:duration-300 after:ease-in-out after:hover:w-full">Menu</a></li>
        <li><a href="/pages/reservation/ReservationBackground" className="relative transition-all duration-300 ease-in-out hover:text-yellow-300 after:block after:content-[''] after:w-0 after:h-[3px] after:bg-yellow-300 after:transition-all after:duration-300 after:ease-in-out after:hover:w-full">Reservations</a></li>
        <li><a href="#" className="relative transition-all duration-300 ease-in-out hover:text-yellow-300 after:block after:content-[''] after:w-0 after:h-[3px] after:bg-yellow-300 after:transition-all after:duration-300 after:ease-in-out after:hover:w-full">Ratings</a></li>
        <li><a href="#" className="relative transition-all duration-300 ease-in-out hover:text-yellow-300 after:block after:content-[''] after:w-0 after:h-[3px] after:bg-yellow-300 after:transition-all after:duration-300 after:ease-in-out after:hover:w-full">Cart</a></li>
        
      </ul>
    </nav>
  </div>
</header>



      </div>
  )
}

export default Header
