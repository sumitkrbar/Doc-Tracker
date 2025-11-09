import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 
import { generateOtpToUser, verifyOtpForUser } from '../services/otpService.js';
import { sendAccountVerificationMail } from '../services/mailService.js';
const generateToken = (userId) =>{
    const payload = userId;
    return jwt.sign(payload, process.env.JWT_SECRET)
}

export const registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body;
    
        
        if(!username || !email || !password){
            throw new Error("Required fields are missing");
        }

        const userExists = await User.findOne({ email });
        if(userExists){
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username: username,
            email,
            password: hashedPassword
        });

        const otp = await generateOtpToUser(email);
        await sendAccountVerificationMail(email, otp);

        res.status(201).json({
            success: true,
            message: "Registration successful. Please verify your email using the OTP sent.",
        });
        // const token = generateToken(newUser._id.toString());
        // const userWithoutPassword = newUser.toObject();
        // delete userWithoutPassword.password;

        // res.json({
        //     success: true,
        //     message: "Registration successful",
        //     user: userWithoutPassword,
        //     token
        // });

    } catch (error) {
        console.error("Error in registerController:", error);
        res.status(500).json({ success: false, message: "Registration failed", error: error.message });
    } 
};


export const verifyOtpController = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        if(!email || !otp){
            throw new Error("Required fields are missing");
        }
        const user = await verifyOtpForUser(email, otp);

        const token = generateToken(user._id.toString());
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        res.json({
            success: true,
            message: "OTP verification successful",
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        console.error("Error in verifyOtpController:", error);
        res.status(400).json({ success: false, message: "OTP verification failed", error: error.message });
    }
};

export const loginController = async (req, res) => {
    try {        
        const { email, password } = req.body;
        if(!email || !password){
            throw new Error("Required fields are missing");
        }
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({ success: false, message: "wrong Password" });
        }
        // If user's email is not verified, generate and send a fresh OTP and ask for verification
        if (!user.isVerified) {
            try {
                const otp = await generateOtpToUser(user.email);
                await sendAccountVerificationMail(user.email, otp);
                return res.json({ success: true, requiresVerification: true, message: "Please verify your email. OTP has been sent.", email: user.email });
            } catch (err) {
                console.error("Error generating/sending OTP on login:", err);
                return res.status(500).json({ success: false, message: "Failed to send OTP. Please try again later." });
            }
        }
        const token = generateToken(user._id.toString());
        
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        
        res.json({
            success: true,
            message: "Login successful",
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error("Error in loginController:", error);
        res.status(500).json({ success: false, message: "Login failed", error: error.message });
    }
};