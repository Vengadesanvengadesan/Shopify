const { writeFileSync } = require('fs');
const path = require('path');
const generateNumber = require('./randomNumber');

const filePath = path.join(__dirname, 'randomNumbers.txt');

for (let i = 0; i < 5; i++) {
    const num = generateNumber();

    writeFileSync(filePath, num + '\n', {
        flag: 'a'
    });
}