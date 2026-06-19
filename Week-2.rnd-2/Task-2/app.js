const http = require('http');

let activeRequests = 0;
const MAX_CONCURRENT = 2;

let queue = [];
let requestId = 0;

const simulateDB = () => {
    return new Promise(resolve => {
        setTimeout(resolve, 3000);
    });
};

const processRequest = async (id, req, res) => {
    activeRequests++;
    console.log(`Request ${id}: processing`);

    const start = Date.now();

    await simulateDB(); 

    const end = Date.now();
    console.log(`Request ${id}: done in ${end - start}ms`);

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Request ${id} completed`);

    activeRequests--;

    if (queue.length > 0) {
        const nextReq = queue.shift();
        nextReq();
    }
};


const server = http.createServer((req, res) => {
    requestId++;
    const id = requestId;

    const task = () => processRequest(id, req, res);

    if (activeRequests < MAX_CONCURRENT) {
        task(); 
    } else {
        console.log(`Request ${id}: queued (waiting)`);
        queue.push(task); 
    }
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});