const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    console.log(`Products Route: ${req.method} ${req.url}`);
    next();
});

router.get('/', (req, res) => {
    res.json({ message: "Products API working" });
});

module.exports = router;