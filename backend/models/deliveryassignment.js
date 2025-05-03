import mongoose from "mongoose";

const deliveryAssignmentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  deliveryPersonId: {
    type: String, // ✅ now stores values like "DP006"
    required: true,
  },
  status: {
    type: String,
    enum: ["Assigned", "Picked Up", "On the Way", "Delivered"],
    default: "Assigned",
  },
  estimatedTime: String,
  deliveredAt: Date,
  eBillUrl: String,
});

export default mongoose.model("DeliveryAssignment", deliveryAssignmentSchema);
