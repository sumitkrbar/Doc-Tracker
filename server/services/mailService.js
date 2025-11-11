import { accountVerificationMail , adminPinSetupMail} from "../utils/mailObject.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendAccountVerificationMail = async (to, token) => {
  const mailOptions = accountVerificationMail(to, token);

  try {
    const { data, error } = await resend.emails.send({
        from: "lekha <onboarding@resend.dev>",
        to: process.env.MAIL_ID,
        subject: mailOptions.subject,
        text: mailOptions.text,
        html: mailOptions.html,
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error("Failed to send verification email via Resend");
    }

    console.log("Resend response data:", data);
  } catch (error) {
    console.error("Error sending verification emails:", error);
    throw new Error("Failed to send verification email");
  }
};

export const sendAdminPinSetupMail = async (to, token) => {
  const mailOptions = adminPinSetupMail(to, token);

  try {
    const { data, error } = await resend.emails.send({
        from: "lekha <onboarding@resend.dev>",
        to: process.env.MAIL_ID,
        subject: mailOptions.subject,
        text: mailOptions.text,
        html: mailOptions.html,
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error("Failed to send admin PIN setup email via Resend");
    }

    console.log("Resend response data:", data);
  } catch (error) {
    console.error("Error sending admin PIN setup emails:", error);
    throw new Error("Failed to send admin PIN setup email");
  }
};