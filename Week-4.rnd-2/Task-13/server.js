const express = require('express');
const app = express();

app.use(express.json());


app.get('/', (req, res) => {
    res.json({ message: "Server is running" });
});

app.get('/error', (req, res, next) => {
    const err = new Error("Something went wrong");
    err.status = 500;
    next(err); // send to error handler
});


app.post('/users', (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            const err = new Error("Name is required");
            err.status = 400;
            throw err;
        }

        res.status(201).json({
            message: "User created"
        });

    } catch (error) {
        next(error); 
    }
});


app.use((req, res, next) => {
    const err = new Error("Route not found");
    err.status = 404;
    next(err);
});


app.use((err, req, res, next) => {
    console.error("Error:", err.message);

    res.status(err.status || 500).json({
        error: err.message || "Something went wrong",
        status: err.status || 500
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});