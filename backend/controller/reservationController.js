import Reservation from "../models/reservation.js";
import nodemailer from "nodemailer";

// Send confirmation email
const sendConfirmationEmail = async (customerEmail, reservationDetails) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'itpgroupproject032025@gmail.com', 
            pass: 'gpvr otaq bsva njgk' 
        }
    });

    const mailOptions = {
        from: 'itpgroupproject032025@gmail.com',
        to: customerEmail,
        subject: 'Your Reservation is Confirmed!',
        html: `
            <h2>Reservation Confirmation</h2>
            <p>Hi <strong>${reservationDetails.name}</strong>,</p>
            <p>Your reservation is confirmed:</p>
            <ul>
                <li><strong>Date:</strong> ${reservationDetails.date}</li>
                <li><strong>Time:</strong> ${reservationDetails.time}</li>
                <li><strong>People:</strong> ${reservationDetails.people}</li>
                <li><strong>Special Request:</strong> ${reservationDetails.specialRequest || "None"}</li>
            </ul>
            <p>Thank you for choosing us!</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

// Create a reservation
export const createReservation = async (req, res) => {
    try {
        const reservation = await Reservation.create(req.body);

        if (reservation.email) {
            await sendConfirmationEmail(reservation.email, reservation);
        }

        res.status(201).json({ message: "Reservation created and email sent!", reservation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create reservation", error: error.message });
    }
};

// Get all reservations
export const getAllReservation = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch reservations", error: error.message });
    }
};

// Get reservation by ID
export const getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch reservation", error: error.message });
    }
};

// Update reservation
// Update reservation
export const updateReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Return updated object
        );
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        res.status(200).json({ message: "Reservation updated successfully", reservation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update reservation", error: error.message });
    }
};


// Delete reservation
export const deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        res.status(200).json({ message: "Reservation deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete reservation", error: error.message });
    }
};
