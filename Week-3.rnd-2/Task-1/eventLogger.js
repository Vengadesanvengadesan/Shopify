
const EventEmitter = require('events');


const eventEmitter = new EventEmitter();

eventEmitter.on('userLogin', (username, time) => {
    console.log("User Login Event Triggered");
    console.log("User:", username);
    console.log("Time:", time);
    console.log(); // empty line for spacing
});

eventEmitter.emit('userLogin', 'John', '10:30 AM');
eventEmitter.emit('userLogin', 'Sara', '10:35 AM');