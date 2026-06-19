const express = require('express');
const app = express();


app.use((req, res, next) => {
    console.log(`Route accessed: ${req.method} ${req.url}`);
    next();
});

const createResponse = (routeName, message) => {
    return {
        route: routeName,
        message: message,
        timestamp: new Date()
    };
};


app.get('/home', (req, res) => {
    res.status(200).json(
        createResponse("home", "Welcome to Home Page")
    );
});

app.get('/about', (req, res) => {
    res.status(200).json(
        createResponse("about", "Welcome to About Page")
    );
});


app.get('/contact', (req, res) => {
    res.status(200).json(
        createResponse("contact", "Welcome to Contact Page")
    );
});

app.use((req, res) => {
    res.status(404).json({
        error: "Route not found",
        status: 404,
        timestamp: new Date()
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});