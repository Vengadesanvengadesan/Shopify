const express = require('express');
const app = express();


const products = [
    { id: 101, name: "Laptop", price: 50000, category: "electronics" },
    { id: 102, name: "Mobile", price: 20000, category: "electronics" },
    { id: 103, name: "Shirt", price: 1500, category: "clothing" },
    { id: 104, name: "Shoes", price: 3000, category: "footwear" },
    { id: 105, name: "Watch", price: 2500, category: "accessories" }
];


app.get('/search', (req, res) => {
    const { name, category } = req.query;

   
    console.log(`Search Query -> Name: ${name}, Category: ${category}`);

    
    if (!name && !category) {
        return res.status(400).json({
            error: "Please provide at least one search query (name or category)"
        });
    }

    let filteredProducts = products;

    
    if (name) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    
    if (category) {
        filteredProducts = filteredProducts.filter(p =>
            p.category.toLowerCase() === category.toLowerCase()
        );
    }

   
    res.status(200).json({
        resultCount: filteredProducts.length,
        products: filteredProducts
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