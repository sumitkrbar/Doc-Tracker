import {accountVerificationMail} from "../utils/mailObject.js";
import { transporter } from "../config/mail.js";

export const sendAccountVerificationMail = async (to, token) => {
    const mailOptions = accountVerificationMail(to, token);
    await transporter.sendMail(mailOptions);
}