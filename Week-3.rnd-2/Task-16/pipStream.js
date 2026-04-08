const fs = require('fs');


const readStream = fs.createReadStream('source.txt', 'utf-8');


const writeStream = fs.createWriteStream('destination.txt');

console.log("Piping started...");
console.log("Data flowing from source.txt to destination.txt");

readStream.pipe(writeStream);

writeStream.on('finish', () => {
    console.log("Pipe complete — destination.txt written successfully");
});