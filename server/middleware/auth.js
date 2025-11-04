import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Protect middleware: verifies JWT and attaches user to req.user
export const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    try {
        // Use verify (not decode) to both validate signature and get payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Support tokens signed with either a plain userId string or an object payload
        const userId = typeof decoded === 'string' ? decoded : decoded?.id || decoded?._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token payload' });
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized: User not found' });
        }

        req.user = user;
        //console.log(req.user);
        
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};