const http = require('http');
const authDB = { token: '12345' };
const userDB = { userId: 1, name: 'Arun', email: 'arun@mail.com', plan: 'pro' };
const billingDB = { userId: 1, due: 1200, nextDate: '2024-02-01' };
const authService = (token) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (token === authDB.token) {
                resolve(true);
            } else {
                reject(new Error('Unauthorized'));
            }
        }, 300);
    });
};
const userService = (userId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: userDB.name,
                email: userDB.email,
                plan: userDB.plan
            });
        }, 500);
    });
};
const billingService = (userId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                due: billingDB.due,
                nextDate: billingDB.nextDate
            });
        }, 400);
    });
};
const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/profile') {
        const token = req.headers['x-auth'];
        try {
            await authService(token);
            const [user, billing] = await Promise.all([
                userService(1),
                billingService(1)
            ]);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ user, billing }, null, 2));
        } catch (err) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: err.message }));
        }
    } 
    
    
    else if (req.method === 'GET' && req.url === '/test') {
    try {
       
        const [user, billing] = await Promise.all([
            userService(1),
            billingService(1)
        ]);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ user, billing }, null, 2));

    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
    }
}else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Not Found' }));
    }
});
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
