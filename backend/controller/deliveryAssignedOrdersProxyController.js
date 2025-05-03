import DeliveryAssignment from "../models/deliveryassignment.js";
import Order from "../models/orderModel.js";
import Delivery from "../models/delivery.js";

export const getAssignedDeliveriesProxy = async (req, res) => {
  try {
    const { id } = req.params; // e.g., "DP006"

    // Now that deliveryPersonId is a string, this works directly
    const assignments = await DeliveryAssignment.find({ deliveryPersonId: id });

    const results = [];

    for (const assign of assignments) {
      const order = await Order.findById(assign.orderId);
      const deliveryPerson = await Delivery.findOne({ DeliveryPersonID: assign.deliveryPersonId });

      if (order && deliveryPerson && order.status === "Confirmed") {
        results.push({
          assignmentId: assign._id,
          orderId: order._id,
          name: order.name,
          phone: order.phone,
          address: order.address,
          items: order.items,
          total: order.total,
          deliveryPersonId: deliveryPerson.DeliveryPersonID,
          deliveryPersonName: deliveryPerson.DeliveryPersonName,
        });
      }
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("❌ Proxy fetch failed:", error);
    res.status(500).json({ message: "Proxy fetch failed", error: error.message });
  }
};
