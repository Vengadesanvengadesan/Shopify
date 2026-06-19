const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {

    if (req.url === '/image') {

        const filePath = path.join(__dirname, 'image.jpg');

        res.writeHead(200, { 'Content-Type': 'image/jpeg' });

        const stream = fs.createReadStream(filePath);

        stream.pipe(res);

    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("Go to /image to see the image");
    }

});


server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});