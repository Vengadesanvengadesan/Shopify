const http = require('http');
const path = require('path');
const fs = require('fs');


const receiveChunks = (req) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
            const buffer = Buffer.concat(chunks);
            resolve(buffer);
        });
        req.on('error', reject);
    });
};


const validateFile = (buffer) => {
    return new Promise((resolve, reject) => {
        const sizeMB = buffer.length / (1024 * 1024);
        if (sizeMB > 1) reject(new Error('File too large (max 1MB)'));
        else resolve(buffer);
    });
};


const scanFile = (buffer) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(buffer), 500); // simulate 500ms scan
    });
};

const saveFile = (buffer, filename = 'photo.jpg') => {
    return new Promise((resolve, reject) => {
        const filepath = path.join(__dirname, filename);
        fs.writeFile(filepath, buffer, (err) => {
            if (err) reject(err);
            else resolve({ filename, size: `${Math.round(buffer.length / 1024)}KB` });
        });
    });
};


const generateThumbnail = (filename = 'photo.jpg') => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const thumb = 'thumb_' + filename;
            resolve(thumb);
        }, 300); 
    });
};


const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/upload') {
        try {
        
            const buffer = await receiveChunks(req);

      
            await validateFile(buffer);

            await scanFile(buffer);

          
            const [fileInfo, thumbnail] = await Promise.all([
                saveFile(buffer, 'photo.jpg'),
                generateThumbnail('photo.jpg')
            ]);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                filename: fileInfo.filename,
                size: fileInfo.size,
                thumbnail
            }, null, 2));

        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else if (req.method === 'GET' && req.url === '/test') {
    const buffer = Buffer.from("dummy file content");

    try {
        await validateFile(buffer);
        await scanFile(buffer);

        const [fileInfo, thumbnail] = await Promise.all([
            saveFile(buffer, 'photo.jpg'),
            generateThumbnail('photo.jpg')
        ]);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            filename: fileInfo.filename,
            size: fileInfo.size,
            thumbnail
        }, null, 2));

    } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
    }
} else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});


server.listen(3000, () => console.log('Server running at http://localhost:3000'));