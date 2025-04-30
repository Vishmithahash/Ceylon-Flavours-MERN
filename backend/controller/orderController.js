// controller/orderController.js

import Order from "../models/orderModel.js";

// ✅ Place a new order (CREATE)
export const placeOrder = async (req, res) => {
  try {
    console.log("Received Order Data: ", req.body);

    const {
      name,
      phone,
      email,
      address,
      postalCode,
      orderType,
      items,
      subtotal,
      deliveryFee,
      total,
    } = req.body;

    const order = new Order({
      customerId: req.user.id,
      name,
      phone,
      email,
      address: address || "",
      postalCode: postalCode || "",
      orderType,
      items,
      subtotal,
      deliveryFee,
      total,
    });

    await order.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
};

// ✅ Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("customerId", "name email");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

// ✅ Get a single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Error fetching order", error: error.message });
  }
};

// ✅ Get logged-in user's orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user's orders:", error);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

// ✅ Update existing order
export const updateOrder = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      postalCode,
      orderType,
      deliveryFee,
      total,
    } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        name,
        phone,
        email,
        address: address || "",
        postalCode: postalCode || "",
        orderType,
        deliveryFee,
        total,
      },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order updated successfully", updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Error updating order", error: error.message });
  }
};

// ✅ Delete order
export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Error deleting order", error: error.message });
  }
};