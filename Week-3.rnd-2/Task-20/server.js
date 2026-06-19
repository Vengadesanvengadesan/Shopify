const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {

    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;

    if (parsedUrl.pathname === '/search') {

        if (Object.keys(query).length === 0) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "No query params found" }));
            return;
        }

   
        console.log("Query received:");
        for (let key in query) {
            console.log(`${key} = ${query[key]}`);
        }

 
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(query));

    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("Use /search?name=arun&city=chennai");
    }

});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
