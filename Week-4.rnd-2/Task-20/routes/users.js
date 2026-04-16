const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    console.log(`Users Route: ${req.method} ${req.url}`);
    next();
});

router.get('/', (req, res) => {
    res.json({ message: "Users API working" });
});

module.exports = router;