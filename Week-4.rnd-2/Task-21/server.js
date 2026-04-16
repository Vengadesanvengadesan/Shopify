const express = require('express');
const app = express();

app.use(express.json());

// Order dataset
let orders = [
    { id: 5001, product: "Laptop", quantity: 1 },
    { id: 5002, product: "Mobile", quantity: 2 }
];

/* -------- GET ALL ORDERS -------- */
app.get('/orders', (req, res) => {
    console.log("GET all orders");

    res.status(200).json({
        totalOrders: orders.length,
        data: orders
    });
});

/* -------- CREATE ORDER -------- */
app.post('/orders', (req, res) => {
    console.log("CREATE order");

    const { product, quantity } = req.body;

    // Validation
    if (!product || typeof quantity !== "number" || quantity <= 0) {
        console.log("Invalid order request");

        return res.status(400).json({
            error: "Product and valid quantity are required"
        });
    }

    const newOrder = {
        id: Date.now(),
        product,
        quantity
    };

    orders.push(newOrder);

    res.status(201).json({
        message: "Order created successfully",
        data: newOrder
    });
});

/* -------- 404 HANDLER -------- */
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

/* -------- SERVER -------- */
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
