const { writeFileSync } = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'students.txt');

function saveStudent(name, age) {
    writeFileSync(filePath, `${name} - ${age}\n`, {
        flag: 'a'
    });
}

module.exports = saveStudent;