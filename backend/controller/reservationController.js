import Reservation from "../Models/Reservation.js"

// Create a new student
export const createReservation = async (req, res) => {
    try {
        const { name, age, subject } = req.body;
        const newReservation = new Reservation({ name, age, subject });
        await newReservation.save();
        res.status(201).json({ message: "Student created successfully", reservation: newReservation });
    } catch (error) {
        res.status(500).json({ message: "Error creating student", error: error.message });
    }
};

// Get all students
export const getAllReservation = async (req, res) => {
    try {
        const reservation = await Reservation.find();
        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ message: "Error fetching students", error: error.message });
    }
};

// Get a student by ID
export const getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).json({ message: "Student not found" });
        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ message: "Error fetching student", error: error.message });
    }
};

// Update a student by ID
export const updateReservation = async (req, res) => {
    try {
        const updatedReservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedReservation) return res.status(404).json({ message: "Student not found" });
        res.status(200).json({ message: "Student updated successfully", reservation: updatedReservation });
    } catch (error) {
        res.status(500).json({ message: "Error updating student", error: error.message });
    }
};

// Delete a student by ID
export const deleteReservation = async (req, res) => {
    try {
        const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);
        if (!deletedReservation) return res.status(404).json({ message: "Student not found" });
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting student", error: error.message });
    }
};
