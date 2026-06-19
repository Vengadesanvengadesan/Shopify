
const EventEmitter = require('events');

const eventEmitter = new EventEmitter();

let count = 0;


eventEmitter.on('orderPlaced', () => {
    count++; // increase counter

    console.log("Order placed successfully");
    console.log("Total Orders:", count);
    console.log(); // space
});


eventEmitter.emit('orderPlaced');
eventEmitter.emit('orderPlaced');
eventEmitter.emit('orderPlaced');
eventEmitter.emit('orderPlaced');
eventEmitter.emit('orderPlaced');