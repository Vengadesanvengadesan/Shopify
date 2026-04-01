const http = require('http');

let totalRequests = 0;
let successCount = 0;
let errorCount = 0;
let totalResponseTime = 0;


const randomDelay = () => Math.floor(100 + Math.random() * 400);


const server = http.createServer(async (req, res) => {
    const startTime = Date.now();
    totalRequests++;

    if (req.method === 'GET' && req.url === '/hello') {
      
        const delay = randomDelay();
        setTimeout(() => {
            successCount++;
            const responseTime = Date.now() - startTime;
            totalResponseTime += responseTime;

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Hello! (Response Time: ${responseTime}ms)`);
        }, delay);

    } else if (req.method === 'GET' && req.url === '/fail') {
       
        const delay = randomDelay();
        setTimeout(() => {
            errorCount++;
            const responseTime = Date.now() - startTime;
            totalResponseTime += responseTime;

            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Internal Server Error (Response Time: ${responseTime}ms)`);
        }, delay);

    } else if (req.method === 'GET' && req.url === '/stats') {
        const avgResponseTime = totalRequests > 0 ? Math.round(totalResponseTime / totalRequests) : 0;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            totalRequests,
            successCount,
            errorCount,
            avgResponseTime: `${avgResponseTime}ms`
        }, null, 2));

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// --- Start server ---
server.listen(3000, () => console.log('Server running at http://localhost:3000'));