const express = require('express');
const app = express();


app.use(express.json());

const validateUser = (req, res, next) => {
    const { name, email } = req.body;

   
    if (!name || !email) {
        console.log("Validation Failed: Missing name or email");

        return res.status(400).json({
            error: "Name and email are required"
        });
    }

    next();
};


const validateProduct = (req, res, next) => {
    const { name, price } = req.body;

    if (!name || typeof price !== "number") {
        console.log("Validation Failed: Invalid product data");

        return res.status(400).json({
            error: "Product name and valid price are required"
        });
    }

    next();
};


app.post('/users', validateUser, (req, res) => {
    res.status(201).json({
        message: "User created successfully",
        data: req.body
    });
});

app.post('/products', validateProduct, (req, res) => {
    res.status(201).json({
        message: "Product created successfully",
        data: req.body
    });
});

app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});