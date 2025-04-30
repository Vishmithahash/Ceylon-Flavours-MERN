// backend/models/config.js
import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
  reservationsOpen: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("Config", configSchema);
