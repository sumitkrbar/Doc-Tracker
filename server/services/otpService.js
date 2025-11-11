import User from "../models/user.js";
import bcrypt from "bcrypt";
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const generateOtpToUser = async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    return otp;
}

export const verifyOtpForUser = async (email, otp) => {
    const user = await User.findOne ({ email });
    if(!user) throw new Error("User not found");

    if(!user.otp || !user.otpExpiry || user.otpExpiry.getTime() < Date.now()){
        throw new Error("Invalid or expired OTP");
    }

    console.log("Verifying OTP for:", email);
    const isOtpValid = await bcrypt.compare(otp, user.otp);

    if(!isOtpValid){
        throw new Error("Invalid OTP");
    }
    
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return user;
}
