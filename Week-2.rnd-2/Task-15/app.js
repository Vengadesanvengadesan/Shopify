const http = require('http');
const { randomUUID } = require('crypto');

const validateOrder = (order) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const { item, qty, userId } = order;
            if (!item || !qty || !userId) {
                reject({ code: 400, message: 'Invalid order data' });
            } else {
                resolve(order);
            }
        }, 200);
    });
};


const checkInventory = (order) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (order.qty > 10) reject({ code: 409, message: 'Insufficient inventory' });
            else resolve({ available: true });
        }, 300);
    });
};


const chargePayment = (order) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.1) reject({ code: 402, message: 'Payment failed' });
            else resolve({ charged: true });
        }, 300);
    });
};


const createShipment = (order) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ trackingId: `TRK-${Math.floor(1000 + Math.random() * 9000)}` });
        }, 200);
    });
};


const sendConfirmation = (order) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ emailSent: true });
        }, 200);
    });
};


const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/orders') {
        let body = '';

        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            try {
                const order = JSON.parse(body);

               
                await validateOrder(order);


                await Promise.all([checkInventory(order), chargePayment(order)]);

            
                const [shipment, confirmation] = await Promise.all([
                    createShipment(order),
                    sendConfirmation(order)
                ]);

      
                const response = {
                    orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
                    status: 'confirmed',
                    trackingId: shipment.trackingId,
                    emailSent: confirmation.emailSent
                };

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(response, null, 2));

            } catch (err) {
             
                const code = err.code || 500;
                res.writeHead(code, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: err.message }));
            }
        });
    } 
    
    
    else if (req.method === 'GET' && req.url === '/test') {

    const order = {
        item: "Laptop",
        qty: 2,
        userId: 1
    };

    try {
        await validateOrder(order);

        await Promise.all([
            checkInventory(order),
            chargePayment(order)
        ]);

        const [shipment, confirmation] = await Promise.all([
            createShipment(order),
            sendConfirmation(order)
        ]);

        const response = {
            orderId: "ORD-1234",
            status: "confirmed",
            trackingId: shipment.trackingId,
            emailSent: confirmation.emailSent
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response, null, 2));

    } catch (err) {
        res.writeHead(err.code || 500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
    }
}else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Not Found' }));
    }
});

server.listen(3000, () => console.log('Server running at http://localhost:3000'));