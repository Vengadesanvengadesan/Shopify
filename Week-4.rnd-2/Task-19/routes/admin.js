

const express = require('express');
const router = express.Router();


const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.use((req, res, next) => {
    console.log(`Admin Route: ${req.method} ${req.url}`);
    next();
});


router.get('/dashboard', (req, res) => {
    res.json({
        message: "Access granted to admin dashboard"
    });
});

module.exports = router;