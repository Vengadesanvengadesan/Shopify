const express = require('express');
const app = express();

app.use('/api', (req, res, next) => {
    console.log(`API Request: ${req.method} ${req.url}`);
    next();
});

const products = [
    { id: 101, name: "Laptop", price: 50000, category: "Electronics" },
    { id: 102, name: "Mobile", price: 20000, category: "Electronics" },
    { id: 103, name: "Shirt", price: 1500, category: "Clothing" },
    { id: 104, name: "Shoes", price: 3000, category: "Footwear" },
    { id: 105, name: "Watch", price: 2500, category: "Accessories" }
];

const isValidProduct = (product) => {
    return typeof product.price === 'number';
};


products.forEach((product, index) => {
    if (!isValidProduct(product)) {
        console.error(`Invalid price in product at index ${index}`);
    }
});


app.get('/api/products', (req, res) => {
    // Sort products alphabetically by name
    const sortedProducts = [...products].sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    res.status(200).json({
        totalProducts: sortedProducts.length,
        products: sortedProducts
    });
});


app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});