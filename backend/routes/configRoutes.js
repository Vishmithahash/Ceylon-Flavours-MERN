// backend/routes/configRoutes.js
import express from "express";
import Config from "../models/config.js";

const router = express.Router();

// Get current reservation status
router.get("/reservation-status", async (req, res) => {
  const config = await Config.findOne();
  res.json(config || { reservationsOpen: true });
});

// Toggle reservation open/close
router.post("/toggle-reservation", async (req, res) => {
  let config = await Config.findOne();
  if (!config) config = new Config();
  config.reservationsOpen = req.body.reservationsOpen;
  await config.save();
  res.json(config);
});

export default router;
