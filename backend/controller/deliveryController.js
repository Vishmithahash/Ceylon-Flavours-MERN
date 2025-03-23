import Delivery from "../models/delivery.js"

// Create delivery
export const createDelivery = async (req, res) => {
    try {
        const { DeliveryPersonID, DeliveryPersonName, DeliveryPersonContactNo, VehicleNo, Status} = req.body;
        const newDelivery = new Delivery({ DeliveryPersonID, DeliveryPersonName, DeliveryPersonContactNo, VehicleNo, Status });
        await newDelivery.save();
        res.status(201).json({ message: "Delivery person added successfully", delivery: newDelivery });
    } catch (error) {
        res.status(500).json({ message: "Error creating delivery", error: error.message });
    }
};

// Get all delivery
export const getAllDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.find();
        res.status(200).json(delivery);
    } catch (error) {
        res.status(500).json({ message: "Error fetching delivery", error: error.message });
    }
};

// Get a delivery by ID
export const getDeliveryById = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id);
        if (!delivery) return res.status(404).json({ message: "Not found" });
        res.status(200).json(delivery);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Dlivery", error: error.message });
    }
};

// Update a delivery by ID
export const updateDelivery = async (req, res) => {
    try {
        const updatedDelivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedDelivery) return res.status(404).json({ message: " Not found" });
        res.status(200).json({ message: "Updated successfully", delivery: updatedDelivery });
    } catch (error) {
        res.status(500).json({ message: "Error updating delivery infomation", error: error.message });
    }
};

// Delete a delivery by ID
export const deleteDelivery = async (req, res) => {
    try {
        const deletedDelivery = await Delivery.findByIdAndDelete(req.params.id);
        if (!deletedDelivery) return res.status(404).json({ message: "Not found" });
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting delivery infomation", error: error.message });
    }
};