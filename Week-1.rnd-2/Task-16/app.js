const { readFileSync } = require('fs');
const path = require('path');


const filePath = path.join(__dirname, 'story.txt');


const data = readFileSync(filePath, 'utf8');


const lines = data.split('\n');


const lineCount = lines.length;

console.log(`Total Lines: ${lineCount}`);