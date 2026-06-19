const fs = require('fs');
const path = require('path');

// filename (you can change this)
const fileName = 'data.txt';

// create full path
const filePath = path.join(__dirname, fileName);

fs.stat(filePath, (err, stats) => {
    if (err) {
        console.log("File not found ❌");
        return;
    }

    console.log(`File: ${fileName}, Size: ${stats.size} bytes`);
});