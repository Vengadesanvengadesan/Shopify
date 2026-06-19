const http = require('http');


function getUsers() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(["Arun", "Priya", "Kiran"]);
           
        }, 500);
    });
}

function getOrders() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([101, 102, 103, 104]);
          
        }, 400);
    });
}


const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET' && req.url === '/summary') {
        Promise.all([getUsers(), getOrders()])
            .then(([users, orders]) => {
                const response = {
                    users,
                    orders,
                    totalUsers: users.length,
                    totalOrders: orders.length
                };
                res.writeHead(200);
                res.end(JSON.stringify(response));
            })
            .catch(err => {
                res.writeHead(500);
                res.end(JSON.stringify({ error: "Internal Server Error", message: err.message }));
            });
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Not found" }));
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});