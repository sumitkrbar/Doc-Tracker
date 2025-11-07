import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,           // Must be 465 for Render
  secure: true,        // Must be true for port 465
  auth: {
    user: process.env.MAIL_ID,       // your Gmail
    pass: process.env.MAIL_PASSWORD,       // your App Password
  },
});

