const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'numbers.txt');
const outputPath = path.join(__dirname, 'evenNumbers.txt');

const data = readFileSync(inputPath, 'utf8');


const numbers = data.split(/\s+/);

let result = "";


for (let i = 0; i < numbers.length; i++) {
    const num = parseInt(numbers[i]);

    if (!isNaN(num) && num % 2 === 0) {
        result += num + '\n';
    }
}

writeFileSync(outputPath, result);

console.log("Even numbers saved!");