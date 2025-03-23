import Reservation from "../models/reservation.js"

// Create a new reservation
export const createReservation = async (req, res) => {
    try {
        const { name, email, phone, date, time, no_of_guests, table_category, notes } = req.body;
        const newReservation = new Reservation({ name, email, phone, date, time, no_of_guests, table_category, notes });
        await newReservation.save();
        res.status(201).json({ message: "reservation created successfully", reservation: newReservation });
    } catch (error) {
        res.status(500).json({ message: "Error creating reservation", error: error.message });
    }
};

// Get all reservation
export const getAllReservation = async (req, res) => {
    try {
        const reservation = await Reservation.find();
        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reservation", error: error.message });
    }
};

// Get a reservation by ID
export const getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).json({ message: "reservation not found" });
        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reservation", error: error.message });
    }
};

// Update a reservation by ID
export const updateReservation = async (req, res) => {
    try {
        const updatedReservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedReservation) return res.status(404).json({ message: "reservation not found" });
        res.status(200).json({ message: "reservation updated successfully", reservation: updatedReservation });
    } catch (error) {
        res.status(500).json({ message: "Error updating reservation", error: error.message });
    }
};

// Delete a reservation by ID
export const deleteReservation = async (req, res) => {
    try {
        const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);
        if (!deletedReservation) return res.status(404).json({ message: "Student not found" });
        res.status(200).json({ message: "reservation deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting reservation", error: error.message });
    }
};

