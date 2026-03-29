const { readdirSync, writeFileSync } = require('fs');
const path = require('path');


const folderPath = path.join(__dirname, 'assets');


const files = readdirSync(folderPath);


const result = files.join('\n');


const outputPath = path.join(__dirname, 'fileList.txt');
writeFileSync(outputPath, result);

console.log("File list saved!");