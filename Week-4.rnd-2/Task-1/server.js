const express = require('express');
const app = express();


app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});


app.get('/', (req, res) => {
    res.json({
        message: "Welcome to Express Server"
    });
});


app.get('/status', (req, res) => {
    res.json({
        message: "Server is running",
        status: "OK"
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});