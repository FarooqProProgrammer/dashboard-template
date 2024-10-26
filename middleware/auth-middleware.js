import jwt from "jsonwebtoken"


export const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};


export const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) return res.status(403).json({ message: 'Access forbidden: insufficient privileges' });
        next();
    };
};