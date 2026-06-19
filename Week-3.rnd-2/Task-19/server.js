const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {

    if (req.url === '/csv') {

        const filePath = path.join(__dirname, 'data.csv');

        
        res.writeHead(200, {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename=data.csv'
        });

       
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);

    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("Go to /csv to download the file");
    }

});


server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});