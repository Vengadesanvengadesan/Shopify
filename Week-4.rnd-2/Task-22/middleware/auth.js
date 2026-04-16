// middleware/auth.js

const auth = (req, res, next) => {
    const token = req.headers['authorization'];

    console.log("Admin Access Attempt:", token);

    if (!token) {
        return res.status(401).json({
            error: "Unauthorized - Token missing"
        });
    }

    if (token !== "admin123") {
        return res.status(401).json({
            error: "Unauthorized - Invalid token"
        });
    }

    next(); // allow access
};

module.exports = auth;