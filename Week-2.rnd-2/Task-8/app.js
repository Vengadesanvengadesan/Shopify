const http = require('http');

let jobs = [];
let idCounter = 1;


function processJob(job) {
    setTimeout(() => {
        job.status = "running";
        console.log(`Job ${job.id} → running`);

        setTimeout(() => {
            job.status = "done";
            console.log(`Job ${job.id} → done`);
        }, Math.floor(Math.random() * 4000) + 1000);

    }, Math.floor(Math.random() * 4000) + 1000);
}

const server = http.createServer((req, res) => {

    
    if (req.method === 'POST' && req.url === '/jobs') {

        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            let data = {};

            try {
                data = JSON.parse(body);
            } catch {}

            const job = {
                id: idCounter++,
                type: data.type || "task",
                status: "queued"
            };

            jobs.push(job);
            processJob(job);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(job));
        });
    }

    else if (req.method === 'GET' && req.url === '/create') {

        const job = {
            id: idCounter++,
            type: "task",
            status: "queued"
        };

        jobs.push(job);
        processJob(job);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(job));
    }

    else if (req.method === 'GET' && req.url === '/jobs') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(jobs));
    }


    else if (req.method === 'GET' && req.url.startsWith('/jobs/')) {

        const id = parseInt(req.url.split('/')[2]);
        const job = jobs.find(j => j.id === id);

        if (!job) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: "Job not found" }));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(job));
    }

    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Route not found" }));
    }
});

server.listen(3000, () => {
    console.log(" Server running at http://localhost:3000");
});