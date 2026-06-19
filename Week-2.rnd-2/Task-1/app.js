const http = require('http');


let requestCount = 0;
let startTime = Date.now();


const logger = async (req, res, next) => {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] ${req.method} ${req.url}`);
    next();
};

const auth = async (req, res, next) => {
    const token = req.headers['x-auth'];

    if (token !== 'secret123') {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.end('Unauthorized');
        return;
    }

    console.log("Auth passed");
    next();
};


const rateLimit = async (req, res, next) => {
    const currentTime = Date.now();

  
    if (currentTime - startTime > 60000) {
        requestCount = 0;
        startTime = currentTime;
    }

    requestCount++;

    if (requestCount > 5) {
        res.writeHead(429, { 'Content-Type': 'text/plain' });
        res.end('Too Many Requests');
        return;
    }

    console.log(`Rate limit: ${requestCount}/5`);
    next();
};


const responseHandler = async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Secure Data Accessed');
    console.log("Response sent");
};


const runMiddleware = (middlewares, req, res) => {
    let index = 0;

    const next = () => {
        const middleware = middlewares[index++];
        if (middleware) {
            middleware(req, res, next);
        }
    };

    next();
};


const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/secure') {
        const middlewares = [logger, auth, rateLimit, responseHandler];
        runMiddleware(middlewares, req, res);
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});


server.listen(3000, () => {
    console.log("Server running on port 3000");
});