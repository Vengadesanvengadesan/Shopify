const express = require('express');
const path = require('path');
const app = express();


app.use((req, res, next) => {
    console.log(`Static Request: ${req.method} ${req.url}`);
    next();
});


app.use(express.static(path.join(__dirname, 'public')));


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});