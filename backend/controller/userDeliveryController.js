import DeliveryAssignment from "../models/deliveryassignment.js";
import Order from "../models/orderModel.js";
import Delivery from "../models/delivery.js";

export const getUserDeliveries = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all orders made by this user
    const userOrders = await Order.find({ customerId: userId });

    const orderIds = userOrders.map(order => order._id);

    const assignments = await DeliveryAssignment.find({
      orderId: { $in: orderIds },
    });

    const results = [];

    for (const assign of assignments) {
      const order = userOrders.find(o => o._id.toString() === assign.orderId.toString());
      const deliveryPerson = await Delivery.findOne({ DeliveryPersonID: assign.deliveryPersonId });

      if (order && deliveryPerson) {
        results.push({
          orderId: order._id,
          name: order.name,
          phone: order.phone,
          address: order.address,
          items: order.items,
          total: order.total,
          eta: assign.estimatedTime,
          eBillUrl: assign.eBillUrl || null,
          deliveryPersonId: deliveryPerson.DeliveryPersonID,
          deliveryPersonName: deliveryPerson.DeliveryPersonName,
          vehicleNo: deliveryPerson.VehicleNo,
        });
      }
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Failed to fetch user deliveries", error);
    res.status(500).json({ message: "Failed to load deliveries" });
  }
};
