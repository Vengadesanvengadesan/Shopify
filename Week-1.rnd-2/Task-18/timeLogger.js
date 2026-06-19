const { writeFileSync } = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'timeLog.txt');

function logTime(message) {
    const now = new Date();

   
    
    const formatted =
        now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');

    const log = `${formatted} - ${message}\n`;

    writeFileSync(filePath, log, { flag: 'a' });
}

module.exports = logTime;