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
            <div style="max-width:600px;margin:0 auto;padding:30px;background-color:#ffffff;border-radius:8px;font-family:'Segoe UI', Tahoma, sans-serif;color:#333;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
  <div style="text-align:center;margin-bottom:20px;">
    <h2 style="color:#100f21;">🍽️ Reservation Confirmation</h2>
    <p style="font-size:16px;">Thank you for choosing <strong>Ceylon Flavors</strong></p>
  </div>

  <p style="font-size:16px;">Hi <strong>${reservationDetails.name}</strong>,</p>

  <p style="font-size:15px;">We're happy to confirm your reservation. Here are the details:</p>

  <table style="width:100%;font-size:15px;margin:20px 0;">
    <tr>
      <td style="padding:8px 0;"><strong>Date:</strong></td>
      <td>${reservationDetails.date}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;"><strong>Time:</strong></td>
      <td>${reservationDetails.time}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;"><strong>People:</strong></td>
      <td>${reservationDetails.people}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;"><strong>Special Request:</strong></td>
      <td>${reservationDetails.specialRequest || "None"}</td>
    </tr>
  </table>

  <p style="font-size:15px;">If you have any questions or changes, feel free to contact us.</p>

  <p style="margin-top:30px;font-size:14px;color:#555;">With warm regards, <br/> <strong>Ceylon Flavors Team</strong></p>

  <div style="margin-top:20px;text-align:center;font-size:13px;color:#999;">
    <p>📍 123 Colombo Street, Sri Lanka<br/>
    ☎️ +94 77 123 4567 | ✉️ info@ceylonflavors.com</p>
  </div>
</div>

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


// Get reservations by user email
export const getReservationByEmail = async (req, res) => {
    try {
      const email = req.params.email;
      const reservations = await Reservation.find({ email });
  
      res.status(200).json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user's reservations", error: error.message });
    }
  };
