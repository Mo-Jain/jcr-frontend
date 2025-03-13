"use server";

import nodemailer from "nodemailer";
import { Buffer } from "buffer";

export async function sendEmailWithPDF(base64Pdf: string, recipient: string) {
  try {
    // Convert Base64 back to Buffer
    const pdfBuffer = Buffer.from(base64Pdf, "base64");

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Set in .env file
        pass: process.env.EMAIL_PASS, // Set in .env file
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient,
      subject: "Booking Details",
      text: "Please find attached the booking details.",
      attachments: [
        {
          filename: "booking.pdf",
          content: pdfBuffer,
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
