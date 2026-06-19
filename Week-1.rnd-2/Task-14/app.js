const { readFileSync, writeFileSync } = require('fs');
const path = require('path');
const createGreeting = require('./greeting');


const inputPath = path.join(__dirname, 'names.txt');
const outputPath = path.join(__dirname, 'greetings.txt');


const data = readFileSync(inputPath, 'utf8');


const names = data.split(/\s+/);

let result = "";


for (let i = 0; i < names.length; i++) {
    if (names[i].length > 0) {
        result += createGreeting(names[i]) + '\n';
    }
}

writeFileSync(outputPath, result);

console.log("Greetings saved!");