import React from "react";

const HomePage = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Image with Text Overlay */}
      <div 
        className="relative w-full min-h-screen bg-black text-white" 
        style={{ 
          backgroundImage: 'url("/pics/wine.jpeg")', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Text on the Faded Image */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to Ceylon Flavors</h1>
          <p className="text-xl text-white mb-8">
            Your ultimate restaurant management system for seamless operations!
          </p>
          <a
            href="#features"
            className="bg-white text-indigo-800 px-6 py-3 rounded-full text-xl hover:bg-gray-200 transition duration-300"
          >
            Explore Features
          </a>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative flex-1 bg-gray-50">
        {/* Features Section */}
        <section id="features" className="py-16 bg-white bg-opacity-90">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-indigo-800">Our Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Menu Management</h3>
                <p>
                  Manage your restaurant’s menu with ease. Add, update, or remove
                  items with just a few clicks.
                </p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Table Reservation</h3>
                <p>
                  Allow customers to reserve tables online. Stay organized and
                  never miss a reservation.
                </p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Order & Cart Management</h3>
                <p>
                  Track customer orders in real-time and ensure seamless service
                  with accurate order management.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-indigo-100 bg-opacity-90">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-indigo-900">About Us</h2>
            <p className="text-lg max-w-3xl mx-auto text-gray-800">
              At Ceylon Flavors, we are dedicated to providing top-notch
              restaurant management services. Our system helps streamline
              operations, boost efficiency, and enhance customer satisfaction.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-white bg-opacity-90">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-indigo-800">Contact Us</h2>
            <p className="text-lg mb-4 text-gray-700">
              Have any questions or need support? Reach out to us!
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

export default HomePage;
