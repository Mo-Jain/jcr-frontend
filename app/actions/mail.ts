"use server";

import nodemailer from "nodemailer";
import { Readable } from "stream";

export async function sendEmailWithAttachment(formData: FormData) {
  try {
    // Extract file and email from formData
    const file = formData.get("file") as File;
    const recipientEmail = formData.get("email") as string;
    const name = formData.get("name") as string;

    if (!file || !recipientEmail) {
      throw new Error("File and recipient email are required");
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert buffer to stream
    const fileStream = new Readable();
    fileStream.push(buffer);
    fileStream.push(null);

    // Configure Nodemailer transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: "Car Rental Agreement",
      text: `Hi,\n\nThis mail is for your acknowledgement to our terms and conditions of the lease agreement between you and us. Please find the attached document for your reference.\n\nKind Regards,\nJain Car Rentals Team`,
      attachments: [
        {
          filename: name,
          content: fileStream,
          contentType: file.type,
        },
      ],
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent!", info };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Error sending email", error };
  }
}
