
const { Readable } = require('stream');

const myStream = new Readable({
    read() {} 
});


myStream.push("Line 1: Hello\n");
myStream.push("Line 2: World\n");
myStream.push("Line 3: Done\n");

myStream.push(null);


myStream.on('data', (chunk) => {
    console.log("Chunk received:", chunk.toString().trim());
});

myStream.on('end', () => {
    console.log("Stream ended");
});