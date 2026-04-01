const http = require('http');


async function parseJSON(body) {
    try {
        return JSON.parse(body);
    } catch (err) {
        throw new Error('Invalid JSON');
    }
}


async function validateSchema(obj) {
    const { name, age, email } = obj;
    if (!name || !age || !email) {
        throw new Error('Missing required fields');
    }
    return obj;
}


async function transformData(obj) {
    return {
        name: obj.name.toUpperCase(),
        age: obj.age,
        email: 'xyz@gamil.com'
    };
}


async function buildResponse(obj) {
    return { success: true, data: obj };
}


const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/process') {
        let body = '';


        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
              
                let data = await parseJSON(body);
                data = await validateSchema(data);
                data = await transformData(data);
                const response = await buildResponse(data);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(response));

            } catch (err) {
        
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: err.message }));
            }
        });
    } 
    
    else if (req.method === 'GET' && req.url === '/test') {

    let body = JSON.stringify({
        name: "Arun",
        age: 25,
        email: "arun@mail.com"
    });

    try {
        let data = JSON.parse(body);
        data = {
            name: data.name.toUpperCase(),
            age: data.age,
            email: "xyz@gamil.com"
        };

        const response = { success: true, data };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));

    } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
    }
}
    else {

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Not Found' }));
    }
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));