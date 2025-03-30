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
      subject: "🚗 Your Ride Has Begun - Buckle Up for an Epic Journey! 🎉",
      text: `Dear Client,
      \n\n
      Guess what? Your self-drive adventure has officially begun! 🚘✨ Your car is now in your hands—so whether you’re cruising through the city or heading for a road trip, make sure to treat it like a best friend (but, you know, one that doesn’t judge your music choices).
      \n\n    
      Attached, you’ll find your booking details and terms & conditions—aka the fine print that ensures smooth sailing (or should we say, smooth driving?).
      \n\n  
      If you need us, just honk… or better yet, call or reply to this email. We’ve got your back!
      \n\n
      Drive safe, have fun, and return with great stories!
      \n\n
      Best regards,
      /n
      Jain Car Rentals
      `,
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
