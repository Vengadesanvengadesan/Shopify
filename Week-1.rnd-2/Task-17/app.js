const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'text.txt');
const outputPath = path.join(__dirname, 'uniqueWords.txt');


const data = readFileSync(inputPath, 'utf8');


const words = data.split(/\s+/);

let unique = [];

for (let i = 0; i < words.length; i++) {
    const word = words[i].toLowerCase();

    if (word && !unique.includes(word)) {
        unique.push(word);
    }
}


const result = unique.join('\n');


writeFileSync(outputPath, result);

console.log("Unique words saved!");