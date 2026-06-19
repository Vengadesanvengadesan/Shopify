const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {

    if (req.url === '/stream') {

        res.writeHead(200, { 'Content-Type': 'text/plain' });

        
        const fileStream = fs.createReadStream(
            path.join(__dirname, 'bigfile.txt'),
            'utf-8'
        );

        fileStream.pipe(res);

    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("Go to /stream to see file content");
    }
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});