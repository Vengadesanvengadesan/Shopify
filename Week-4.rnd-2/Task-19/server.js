const express = require('express');
const app = express();

app.use(express.json());


const adminRoutes = require('./routes/admin');

app.get('/', (req, res) => {
    res.json({ message: "Public route working" });
});

app.use('/admin', adminRoutes);

app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});