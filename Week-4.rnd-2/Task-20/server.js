const express = require('express');
const app = express();

app.use(express.json());


const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');


app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);


app.get('/', (req, res) => {
    res.json({ message: "Multi Router App Running" });
});


app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});