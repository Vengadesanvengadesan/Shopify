const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'important.txt');
const backupPath = path.join(__dirname, 'important_backup.txt');


const data = readFileSync(inputPath, 'utf8');


writeFileSync(backupPath, data);

console.log("Backup created successfully");