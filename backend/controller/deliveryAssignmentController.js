import DeliveryAssignment from "../models/deliveryassignment.js";
import Delivery from "../models/delivery.js";
import Order from "../models/orderModel.js";

// Assign delivery to an order (Admin only)
export const assignDelivery = async (req, res) => {
  try {
    const { orderId, deliveryPersonId, estimatedTime } = req.body;

    const newAssignment = new DeliveryAssignment({
      orderId,
      deliveryPersonId,
      estimatedTime,
    });

    await newAssignment.save();
    res.status(201).json({ message: "Delivery Assigned Successfully", assignment: newAssignment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get deliveries assigned to a delivery person
export const getAssignmentsForDeliveryPerson = async (req, res) => {
  try {
    const assignments = await DeliveryAssignment.find({ deliveryPersonId: req.params.id })
      .populate("orderId")
      .populate("deliveryPersonId");
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get delivery assignment by order ID (for customer)
export const getAssignmentByOrder = async (req, res) => {
  try {
    const assignment = await DeliveryAssignment.findOne({ orderId: req.params.orderId })
      .populate("orderId")
      .populate("deliveryPersonId");

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update delivery status and ETA (by delivery person)
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { status, estimatedTime } = req.body;
    const updated = await DeliveryAssignment.findByIdAndUpdate(
      req.params.id,
      { status, estimatedTime, deliveredAt: status === "Delivered" ? new Date() : null },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload E-bill URL (link to PDF image or file)
export const uploadEBill = async (req, res) => {
  try {
    const { eBillUrl } = req.body;
    const updated = await DeliveryAssignment.findByIdAndUpdate(
      req.params.id,
      { eBillUrl },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
