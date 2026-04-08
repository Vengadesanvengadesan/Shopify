const http = require('http');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'sample.txt');

const server = http.createServer((req, res) => {

    if (req.url === '/readfile') {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end("Error reading file");
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
        });
    }

    else if (req.url === '/streamfile') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });

        const stream = fs.createReadStream(filePath, 'utf-8');
        stream.pipe(res);
    }

   
    else {
        res.writeHead(200);
        res.end("Use /readfile or /streamfile");
    }
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});