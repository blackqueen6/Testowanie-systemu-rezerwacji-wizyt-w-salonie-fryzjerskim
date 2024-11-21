import jwt from 'jsonwebtoken';
import Hairdresser from '../models/HairdresserSchema.js';
import User from '../models/UserSchema.js';

export const authenticate = async (req, res, next) => {
    const authToken = req.headers.authorization;
    if (!authToken || !authToken.startsWith('Bearer ')) {
        console.log('Brak tokena lub niepoprawny format tokena');
        return res.status(401).json({ success: false, message: 'Brak dostępu' });
    }

    const token = authToken.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log('Token wygasł');
            return res.status(401).json({ message: 'Token wygasł' });
        }
        console.log('Nieważny token:', error.message);
        return res.status(401).json({ success: false, message: 'Nieważny token' });
    }
};

export const restrick = (roles) => {
    return async (req, res, next) => {
        const userId = req.userId;
        if (!userId) {
            return res.status(403).json({ success: false, message: 'Brak dostępu' });
        }

        const user = await User.findById(userId) || await Hairdresser.findById(userId);

        if (!user) {
            return res.status(403).json({ success: false, message: 'Brak dostępu' });
        }

        if (!roles.includes(user.role)) {
            return res.status(403).json({ success: false, message: 'Brak dostępu' });
        }

        next();
    };
};