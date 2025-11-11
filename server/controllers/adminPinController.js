import User from '../models/user.js';
import bcrypt from 'bcrypt';
import { sendAdminPinSetupMail} from '../services/mailService.js';

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
//Check if admin pin is already set
export const checkAdminPinStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("isAdminPinSet");
        return res.json({
            success: true,
            isAdminPinSet: user.isAdminPinSet
        });
    } catch (error) {
        console.error("Error in checkAdminPinStatus:", error);
        res.status(500).json({ success: false, message: "Failed to check admin pin status" });
    }
};


//Init admin pin setup/reset (verify password + send OTP to OWNER)
export const initAdminPinSetup = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) throw new Error("Password is required");

        const user = await User.findById(req.user._id);
        if (!user) throw new Error("User not found");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }

        const otp = generateOTP();
        const hashedOtp = await bcrypt.hash(otp, 10);

        user.adminOtp = hashedOtp;
        user.adminOtpExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();
        await sendAdminPinSetupMail(user.email, otp);

        res.json({
            success: true,
            message: "OTP sent to admin email. Verify OTP to proceed."
        });

    } catch (error) {
        console.error("Error in initAdminPinSetup:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


//Verify OTP from Owner
export const verifyAdminOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        if (!otp) throw new Error("OTP is required");

        const user = await User.findById(req.user._id);
        if (!user || !user.adminOtp || !user.adminOtpExpiry) {
            return res.status(400).json({ success: false, message: "No admin OTP found. Start setup again." });
        }

        if (user.adminOtpExpiry < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP expired. Request new OTP." });
        }

        const isOtpValid = await bcrypt.compare(otp, user.adminOtp);
        if (!isOtpValid) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        user.adminOtp = null;
        user.adminOtpExpiry = null;
        await user.save();

        res.json({
            success: true,
            message: "OTP verified successfully. You may now set a new Admin PIN."
        });

    } catch (error) {
        console.error("Error in verifyAdminOtp:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


//Set / Reset Admin PIN
export const setAdminPin = async (req, res) => {
    try {
        const { pin } = req.body;
        if (!pin) throw new Error("PIN is required");

        if (!/^\d{4}$/.test(pin)) {
            return res.status(400).json({ success: false, message: "PIN must be exactly 4 numeric digits" });
        }

        const user = await User.findById(req.user._id);
        const hashedPin = await bcrypt.hash(pin, 10);

        user.adminPin = hashedPin;
        user.isAdminPinSet = true;
        user.adminPinUpdatedAt = new Date();
        await user.save();

        res.json({
            success: true,
            message: "Admin PIN set successfully"
        });

    } catch (error) {
        console.error("Error in setAdminPin:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


//Verify Admin PIN (before edit/delete)
export const verifyAdminPin = async (req, res) => {
    try {
        const { pin } = req.body;
        if (!pin) throw new Error("PIN is required");

        const user = await User.findById(req.user._id).select("adminPin");
        if (!user.adminPin) {
            return res.status(400).json({ success: false, message: "Admin PIN is not set" });
        }

        const isPinCorrect = await bcrypt.compare(pin, user.adminPin);
        if (!isPinCorrect) {
            return res.status(400).json({ success: false, message: "Invalid Admin PIN" });
        }

        res.json({
            success: true,
            message: "PIN verified. Access granted."
        });

    } catch (error) {
        console.error("Error in verifyAdminPin:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
