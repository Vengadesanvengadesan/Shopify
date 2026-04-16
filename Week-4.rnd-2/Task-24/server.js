const express = require('express');
const app = express();

app.use(express.json());

// Import modules
const userRoutes = require('./routes/userRoutes');
const logger = require('./middleware/logger');

// Apply middleware
app.use(logger);

// Use routes
app.use('/api/users', userRoutes);

// Home route
app.get('/', (req, res) => {
    res.json({
        message: "Application running successfully"
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

// Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});