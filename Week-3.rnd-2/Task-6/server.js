const http = require('http');

const server = http.createServer((req, res) => {

    console.log("Method:", req.method, "URL:", req.url);

    
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end("Request received successfully");
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});