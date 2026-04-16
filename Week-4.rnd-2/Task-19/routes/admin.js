// routes/admin.js

const express = require('express');
const router = express.Router();

// Import middleware
const authMiddleware = require('../middleware/auth');

// Apply middleware ONLY to this router
router.use(authMiddleware);

// Log admin route access
router.use((req, res, next) => {
    console.log(`Admin Route: ${req.method} ${req.url}`);
    next();
});

// Protected route
router.get('/dashboard', (req, res) => {
    res.json({
        message: "Access granted to admin dashboard"
    });
});

module.exports = router;