
const EventEmitter = require('events');

const eventEmitter = new EventEmitter();

eventEmitter.once('serverStart', () => {
    console.log("Server started for the first time");
});


eventEmitter.on('serverStart', () => {
    console.log("Server is running");
});


eventEmitter.emit('serverStart');
eventEmitter.emit('serverStart');
eventEmitter.emit('serverStart');