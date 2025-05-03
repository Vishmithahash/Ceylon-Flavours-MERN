import React, { useEffect, useState } from "react";
import axios from "axios";

function CustomerDeliveries() {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/my-deliveries`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeliveries(res.data);
      } catch (error) {
        console.error("Error fetching deliveries", error);
      }
    };

    fetchDeliveries();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-4xl font-bold mb-10 text-center text-green-700 flex items-center gap-2">
        📦 My Deliveries
      </h2>

      {deliveries.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No delivery information available yet.
        </p>
      ) : (
        <div className="w-full flex justify-center">
          <div className="w-full max-w-xl space-y-8">
            {deliveries.map((d, i) => (
              <div
                key={i}
                className="bg-green-50 border border-green-300 rounded-xl shadow-lg p-6 transition hover:shadow-xl"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    🚚 Estimated Arrival Time:
                  </h3>
                  <p className="text-xl text-green-700 font-semibold tracking-wide">
                    {d.eta || "Not Provided"}
                  </p>
                </div>

                <div className="mb-2">
                  <h4 className="text-sm font-semibold text-gray-600">
                    Delivery Person Name:
                  </h4>
                  <p className="text-indigo-800 font-medium">{d.deliveryPersonName}</p>
                </div>

                <div className="mb-2">
                  <h4 className="text-sm font-semibold text-gray-600">
                    Delivery Person ID:
                  </h4>
                  <p className="font-mono text-gray-800">{d.deliveryPersonId}</p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-600">Vehicle Number:</h4>
                  <p className="text-gray-800">{d.vehicleNo}</p>
                </div>

                <div className="mt-6 text-center">
                  {d.eBillUrl ? (
                    <>
                      <h4 className="text-sm font-semibold text-gray-600 mb-2">E-Bill:</h4>
                      <embed
                        src={d.eBillUrl}
                        type="application/pdf"
                        width="100%"
                        height="350px"
                        className="rounded border"
                      />
                    </>
                  ) : (
                    <p className="italic text-gray-400">E-Bill not uploaded yet</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDeliveries;
