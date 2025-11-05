import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

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

        const token = generateToken(newUser._id.toString());
        const userWithoutPassword = newUser.toObject();
        delete userWithoutPassword.password;

        res.json({
            success: true,
            message: "Registration successful",
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error("Error in registerController:", error);
        res.status(500).json({ success: false, message: "Registration failed", error: error.message });
    } 
};   

export const loginController = async (req, res) => {
    try {
        console.log(req.body);
        
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
        const token = generateToken(user._id.toString());
        
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        console.log(userWithoutPassword, token);
        
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