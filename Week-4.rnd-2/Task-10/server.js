const express = require('express');
const app = express();


const items = [];
for (let i = 1; i <= 20; i++) {
    items.push({ id: i, name: `Item ${i}` });
}

app.get('/items', (req, res) => {
    let { page, limit } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 5;

  
    console.log(`Pagination Request -> Page: ${page}, Limit: ${limit}`);

  
    if (page < 1 || limit < 1) {
        return res.status(400).json({
            error: "Page and limit must be positive numbers"
        });
    }

    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / limit);

    if (page > totalPages) {
        return res.status(404).json({
            error: "Page not found"
        });
    }

    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedItems = items.slice(startIndex, endIndex);

    
    res.status(200).json({
        page,
        limit,
        totalItems,
        totalPages,
        data: paginatedItems
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