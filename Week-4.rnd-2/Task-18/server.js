const express = require('express');
const app = express();

app.use(express.json());

// Import routes
const userRoutes = require('./routes/users');

// Use routes
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Server running" });
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