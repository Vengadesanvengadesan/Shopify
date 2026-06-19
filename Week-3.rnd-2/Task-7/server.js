const http = require('http');

const server = http.createServer((req, res) => {

   
    console.log("Headers Received:");
    console.log(req.headers);

    
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end("Headers received successfully");
});


server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});