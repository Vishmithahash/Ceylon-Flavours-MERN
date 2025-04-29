import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // 1. Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,   // Your Gmail (example: yourapp@gmail.com)
      pass: process.env.EMAIL_PASS,   // Your App Password (16 characters one)
    },
    secure: true,
  });

  // 2. Email options
  const mailOptions = {
    from: `"Ceylon Flavors" <${process.env.EMAIL_USER}>`, // Sender name + your Gmail
    to: options.to,       // Receiver email
    subject: options.subject, // Subject line
    html: options.html,       // HTML body content
  };

  // 3. Send email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email could not be sent. Please try again later.");
  }
};

export default sendEmail;
