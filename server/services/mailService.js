import { accountVerificationMail } from "../utils/mailObject.js";
import { transporter } from "../config/mail.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendAccountVerificationMail = async (to, token) => {
  const mailOptions = accountVerificationMail(to, token);

  try {
    // 1) Send through Nodemailer
    //await transporter.sendMail(mailOptions);

    // 2) Send through Resend (check result)
    // send otp to admin mail 
    const { data, error } = await resend.emails.send({
        from: "lekha <onboarding@resend.dev>",
        to: process.env.MAIL_ID,
        subject: mailOptions.subject,
        text: mailOptions.text,
        html: mailOptions.html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error("Failed to send verification email via Resend");
    }

  } catch (error) {
    console.error("Error sending verification emails:", error);
    throw new Error("Failed to send verification email");
  }
};
