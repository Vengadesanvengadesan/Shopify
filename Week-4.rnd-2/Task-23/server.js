const express = require('express');
const app = express();

app.use(express.json());

// Import product router
const productRoutes = require('./routes/products');

// Apply router (NO global logging here)
app.use('/products', productRoutes);

// Public route (no logging applied)
app.get('/', (req, res) => {
    res.json({ message: "Home route (no logging here)" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});