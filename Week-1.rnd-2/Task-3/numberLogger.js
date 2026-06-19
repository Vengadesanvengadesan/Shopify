const { writeFileSync } = require('fs');

function logNumber(number) {
    writeFileSync('./numbers.txt', `${number}\n`, {
        encoding: 'utf8',
        flag: 'a'   //append
    });
}

module.exports = logNumber;