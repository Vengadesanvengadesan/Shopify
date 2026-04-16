const express = require('express');
const app = express();

app.use(express.json());

let products = [
    { id: 101, name: "Laptop", price: 50000, category: "Electronics" },
    { id: 102, name: "Mobile", price: 20000, category: "Electronics" }
];

const validateProduct = (product) => {
    return (
        product.name &&
        typeof product.price === "number" &&
        product.category
    );
};

app.get('/products', (req, res) => {
    console.log("GET all products");
    res.status(200).json(products);
});


app.post('/products', (req, res) => {
    console.log("CREATE product");

    const { name, price, category } = req.body;

    if (!validateProduct(req.body)) {
        return res.status(400).json({
            error: "Name, numeric price, and category are required"
        });
    }

    const newProduct = {
        id: Date.now(),
        name,
        price,
        category
    };

    products.push(newProduct);

    res.status(201).json({
        message: "Product created successfully",
        data: newProduct
    });
});

app.put('/products/:id', (req, res) => {
    console.log("UPDATE product");

    const id = parseInt(req.params.id);

    if (!validateProduct(req.body)) {
        return res.status(400).json({
            error: "Name, numeric price, and category are required"
        });
    }

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            error: "Product not found"
        });
    }

    product.name = req.body.name;
    product.price = req.body.price;
    product.category = req.body.category;

    res.status(200).json({
        message: "Product updated successfully",
        data: product
    });
});


app.delete('/products/:id', (req, res) => {
    console.log("DELETE product");

    const id = parseInt(req.params.id);

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "Product not found"
        });
    }

    products.splice(index, 1);

    res.status(200).json({
        message: "Product deleted successfully"
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