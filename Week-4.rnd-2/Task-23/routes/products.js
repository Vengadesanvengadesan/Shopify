const express = require('express');
const router = express.Router();

// Router-level logging middleware
router.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} /products - ${res.statusCode} (${duration}ms)`);
    });

    next();
});

/* -------- ROUTES -------- */

// GET products
router.get('/', (req, res) => {
    res.status(200).json({
        message: "Products API working"
    });
});

// Example POST
router.post('/', (req, res) => {
    res.status(201).json({
        message: "Product created"
    });
});

module.exports = router;