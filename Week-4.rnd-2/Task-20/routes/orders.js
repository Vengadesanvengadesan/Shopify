const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    console.log(`Orders Route: ${req.method} ${req.url}`);
    next();
});

router.get('/', (req, res) => {
    res.json({ message: "Orders API working" });
});

module.exports = router;