// Ensure that this middleware is applied correctly
export const accessControl = (req, res, next) => {
    // You can add conditions here based on your authentication logic
    if (req.method === 'POST' && req.path === '/api/v1/register') {
        return next(); // Allow access to the registration route
    }

    // For other routes, you might check for a valid session or user
    if (!req.session.userId) {
        return res.status(403).json({ message: "Access denied" });
    }

    next();
};
