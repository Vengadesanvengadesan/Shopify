const express = require('express');
const router = express.Router();


router.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} /products - ${res.statusCode} (${duration}ms)`);
    });

    next();
});




router.get('/', (req, res) => {
    res.status(200).json({
        message: "Products API working"
    });
});


router.post('/', (req, res) => {
    res.status(201).json({
        message: "Product created"
    });
});

module.exports = router;