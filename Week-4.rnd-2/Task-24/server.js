const express = require('express');
const app = express();

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const logger = require('./middleware/logger');


app.use(logger);


app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.json({
        message: "Application running successfully"
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