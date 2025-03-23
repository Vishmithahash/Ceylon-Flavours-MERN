import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      orderType: { type: String, required: true },
    },
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
    status: { type: String, default: "Pending" }, // Default order status
  },
  { timestamps: true } //  Auto add createdAt, updatedAt fields
);

export default mongoose.model("Order", orderSchema);
