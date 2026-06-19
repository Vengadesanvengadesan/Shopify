const http = require('http');

const server = http.createServer((req, res) => {


    const startTime = Date.now();


    let responseText = "";

    if (req.url === '/' && req.method === 'GET') {
        responseText = "Home Page";
    } 
    else if (req.url === '/api' && req.method === 'GET') {
        responseText = "API Route";
    } 
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end("Page not found");
        return;
    }

    const responseTime = Date.now() - startTime;

    res.setHeader('X-Powered-By', 'Node.js');
    res.setHeader('X-Response-Time', responseTime + 'ms');
    res.setHeader('Content-Type', 'text/html');

    res.writeHead(200);
    res.end(responseText);

    console.log("Response Headers Sent:");
    console.log("X-Powered-By:", res.getHeader('X-Powered-By'));
    console.log("X-Response-Time:", res.getHeader('X-Response-Time'));
    console.log("Content-Type:", res.getHeader('Content-Type'));
    console.log();
});


server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});