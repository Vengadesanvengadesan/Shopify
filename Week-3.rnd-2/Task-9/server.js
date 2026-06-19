const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {

    let filePath = '';

    
    if (req.url === '/') {
        filePath = path.join(__dirname, 'home.html');
    } 
    else if (req.url === '/about') {
        filePath = path.join(__dirname, 'about.html');
    } 
    else if (req.url === '/contact') {
        filePath = path.join(__dirname, 'contact.html');
    } 
    else {
        res.writeHead(404);
        res.end("Page not found");
        return;
    }

    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end("Error loading file");
            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });

});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});