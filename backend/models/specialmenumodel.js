import mongoose from "mongoose";

const specialMenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  category: {
    type: String,
    enum: ["Appetizers", "Main Dishes", "Desserts", "Beverages"],
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  specialDay: {
    type: String, // example: "05-02"
    required: true,
  },
});

const SpecialMenu = mongoose.model("SpecialMenu", specialMenuItemSchema);
export default SpecialMenu;
