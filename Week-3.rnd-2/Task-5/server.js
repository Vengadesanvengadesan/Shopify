const http = require('http');

const server = http.createServer((req, res) => {

    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("Welcome to my Node Server");
    }

   
    else if (req.url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("This server is built using Node.js");
    }

  
    else if (req.url === '/contact') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("Contact us at: contact@example.com");
    }

    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end("Page not found");
    }
});


server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});