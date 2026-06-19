const express = require('express');
const app = express();

app.use(express.json());

// Import modules
const logger = require('./middleware/logger');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');


app.use(logger);


app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);


app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "API running successfully"
    });
});


app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});