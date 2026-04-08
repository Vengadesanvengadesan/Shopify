
const EventEmitter = require('events');

const eventEmitter = new EventEmitter();

eventEmitter.on('error', (err) => {
    console.log("Error:", err.message);
});


eventEmitter.on('processData', (data) => {

    console.log("Processing:", data);

    
    if (!data) {
        eventEmitter.emit('error', new Error("Invalid data received"));
    } else {
        console.log("Data processed successfully");
    }

    console.log();
});

eventEmitter.emit('processData', 'valid data');


eventEmitter.emit('processData', null);