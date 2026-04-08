const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const server = http.createServer(async (req, res) => {


    const url = new URL(req.url, `http://${req.headers.host}`);
    const name = url.searchParams.get('name') || 'Guest';

    try {
    
        const filePath = path.join(__dirname, 'template.html');
        let data = await fs.readFile(filePath, 'utf-8');

        
        data = data.replace('{{username}}', name);

        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);

    } catch (err) {
        res.writeHead(500);
        res.end("Error loading template");
    }

});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});