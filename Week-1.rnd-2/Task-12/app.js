const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'sentence.txt');
const outputPath = path.join(__dirname, 'reverse.txt');

const data = readFileSync(inputPath, 'utf8');

const reversed = data.split('').reverse().join('');


writeFileSync(outputPath, reversed);

console.log("Reversed content saved!");