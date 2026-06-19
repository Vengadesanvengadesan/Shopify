
const EventEmitter = require('events');


const eventEmitter = new EventEmitter();

eventEmitter.on('productAdded', (product) => {
    console.log("Product saved to database:", product);
});

eventEmitter.on('productAdded', (product) => {
    console.log("Email notification sent for:", product);
});

eventEmitter.on('productAdded', (product) => {
    console.log("Inventory updated for:", product);
});


eventEmitter.emit('productAdded', 'Laptop');