const express = require('express');
const app = express();


const products = [
    { id: 101, name: "Laptop", price: 50000, category: "Electronics" },
    { id: 102, name: "Mobile", price: 20000, category: "Electronics" },
    { id: 103, name: "Shirt", price: 1500, category: "Clothing" },
    { id: 104, name: "Shoes", price: 3000, category: "Footwear" },
    { id: 105, name: "Watch", price: 2500, category: "Accessories" }
];


app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);

    console.log(`Requested Product ID: ${req.params.id}`);

    if (isNaN(productId)) {
        return res.status(400).json({
            error: "Invalid product ID format"
        });
    }

  
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({
            error: "Product not found"
        });
    }

   
    res.status(200).json({
        ...product,
        requestTime: new Date()
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