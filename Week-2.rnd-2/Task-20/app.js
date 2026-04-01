const http = require('http');

const users = ["Arun", "Priya", "Kiran"];
const products = ["Laptop", "Phone", "Tablet"];

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET' && req.url === '/users') {
        res.writeHead(200);
        res.end(JSON.stringify({ users }));
    } else if (req.method === 'GET' && req.url === '/products') {
        res.writeHead(200);
        res.end(JSON.stringify({ products }));
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Not found" }));
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
