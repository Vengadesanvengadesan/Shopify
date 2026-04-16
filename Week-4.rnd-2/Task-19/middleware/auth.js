// middleware/auth.js

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    console.log(`Auth Attempt -> Token: ${token}`);

    if (!token) {
        return res.status(401).json({
            error: "Unauthorized - Token missing"
        });
    }

    if (token !== "admin123") {
        return res.status(403).json({
            error: "Forbidden - Invalid token"
        });
    }

    next(); // valid → continue
};

module.exports = authMiddleware;