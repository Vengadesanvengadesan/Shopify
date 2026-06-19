
const fs = require('fs');


const writeStream = fs.createWriteStream('output.txt');

console.log("Writing line 1...");
writeStream.write("Name: Arun\n");

console.log("Writing line 2...");
writeStream.write("Age: 25\n");

console.log("Writing line 3...");
writeStream.write("City: Chennai\n");

console.log("Writing line 4...");
writeStream.write("Role: Developer\n");

writeStream.end();


writeStream.on('finish', () => {
    console.log("All data written to output.txt");
});