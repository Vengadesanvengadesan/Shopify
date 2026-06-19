const express = require('express');
const app = express();

app.use(express.json());


const productRoutes = require('./routes/products');


app.use('/products', productRoutes);


app.get('/', (req, res) => {
    res.json({ message: "Home route (no logging here)" });
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