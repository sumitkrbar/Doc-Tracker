import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_ID,  // your gmail
    pass: process.env.MAIL_PASSWORD,  // your app password
  }
});
