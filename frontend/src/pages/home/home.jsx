import React from "react";

const HomePage = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
     

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-indigo-800 text-white text-center py-24">
          <h1 className="text-4xl font-bold mb-4">Welcome to Ceylon Flavors</h1>
          <p className="text-xl mb-8">
            Your ultimate restaurant management system for seamless operations!
          </p>
          <a
            href="#features"
            className="bg-white text-indigo-800 px-6 py-3 rounded-full text-xl hover:bg-gray-200"
          >
            Explore Features
          </a>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Key Features</h2>
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
        <section id="about" className="py-16 bg-indigo-100">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">About Us</h2>
            <p className="text-lg max-w-3xl mx-auto">
              At Ceylon Flavors, we are dedicated to providing top-notch
              restaurant management services. Our system helps streamline
              operations, boost efficiency, and enhance customer satisfaction.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
            <p className="text-lg mb-4">Have any questions or need support? Reach out to us!</p>
            <a href="mailto:support@ceylonflavors.com" className="text-indigo-600 text-xl">
              support@ceylonflavors.com
            </a>
          </div>
        </section>
      </main>

      
    </div>
  );
};

export default HomePage;
