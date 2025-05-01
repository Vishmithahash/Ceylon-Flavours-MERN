import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String },       // optional for Pick up
    postalCode: { type: String },    // optional for Pick up
    orderType: { type: String, required: true },

    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, default: "Pending" },

    trackingStatus: {
      type: String,
      enum: [
        "Order Placed",
        "Order Confirmed",
        "Order is Being Prepared",
        "Order Preparation Completed",
        "Order Handover to Delivery",
        "Ready to Pick Up" 
      ],
      default: "Order Placed"
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
