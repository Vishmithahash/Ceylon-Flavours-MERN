import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
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
});

const Menu = mongoose.model("Menu", menuItemSchema);
export default Menu;

