import React from "react";
import { Link } from "react-router-dom";

const ReservationManagement = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Image with Text Overlay */}
      <div 
        className="relative w-full min-h-screen bg-black text-white" 
        style={{ 
          backgroundImage: 'url("/pics/tables.jpg")', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>




        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
  <h1 className="text-4xl font-bold text-white mb-4">Ceylon Flavors - Let's Book a Table</h1>
  <p className="text-xl text-white mb-8">
    Manage and track all customer reservations for a smooth dining experience.
  </p>

  <Link to="/my-reservations">
    <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold shadow-md transition duration-300">
      View Your Current Reservations
    </button>
  </Link>
</div>





        {/* Text on the Faded Image */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
        </div>
      </div>

      {/* Main Content */}
      <main className="relative flex-1 bg-gray-50">
        {/* Reservation Process Section */}
        <section id="reservation-process" className="py-16 bg-white bg-opacity-90">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-indigo-800">Reservation Process</h2>
            <p className="text-lg max-w-3xl mx-auto text-gray-700">
              Customers can reserve tables easily online, and staff members are notified instantly to confirm and assist with the reservation. The entire reservation process is automated and efficient.
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Online Reservation</h3>
                <p>
                  Customers can make reservations through our online system, selecting date, time, and number of guests.
                </p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Confirmation by Staff</h3>
                <p>
                  Staff members are notified of the reservation and confirm via email notifications
                </p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Reservation Modification</h3>
                <p>
                  You can modify your own Reservations
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Staff Assistance Section */}
        <section id="staff-assistance" className="py-16 bg-indigo-100 bg-opacity-90">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-indigo-900">Staff Assistance During Reservation</h2>
            <p className="text-lg max-w-3xl mx-auto text-gray-800">
              Our staff provides personalized service during the reservation to ensure guests have a memorable dining experience.
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Greet and Seat</h3>
                <p>
                  Our waitstaff will greet the guests upon arrival and escort them to their table.
                </p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Menu Assistance</h3>
                <p>
                  Waitstaff are available to assist guests in choosing their meals and beverages.
                </p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Order Handling</h3>
                <p>
                  Staff ensure orders are taken promptly and delivered in a timely manner.
                </p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Feedback and Reviews</h3>
                <p>
                  After dining, guests are encouraged to leave feedback, ensuring we continue improving.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Make a Reservation Button */}
        <div className="flex justify-center mt-6">
          <Link to="/reservation">
            <button type="button" className="bg-[#361a1d] text-white px-6 py-3 rounded-full hover:bg-[#291316] transition duration-300">
              Make a Reservation
            </button>
          </Link>
        </div>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-white bg-opacity-90">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-indigo-800">Contact Us</h2>
            <p className="text-lg mb-4 text-gray-700">
              Have any questions or need support with your reservation? Reach out to us!
            </p>
            <a href="mailto:support@ceylonflavors.com" className="text-indigo-600 text-xl hover:underline">
              support@ceylonflavors.com
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ReservationManagement;
