const express = require('express');
const app = express();

app.use(express.json());


const auth = require('./middleware/auth');


app.get('/', (req, res) => {
    res.json({ message: "Public route working" });
});

app.get('/admin', auth, (req, res) => {
    console.log("Admin route accessed");

    res.json({
        message: "Welcome Admin"
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