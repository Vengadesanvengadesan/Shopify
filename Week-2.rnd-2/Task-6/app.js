const EventEmitter = require('events');
const fs = require('fs');

const emitter = new EventEmitter();


emitter.on('dataReceived', async (data) => {
    console.log("dataReceived →", data);

    if (data && data.value !== undefined) {
        emitter.emit('dataValid', data);
    } else {
        emitter.emit('dataInvalid');
    }
});

emitter.on('dataValid', async (data) => {
    console.log("dataValid → validation passed");

  
    const processed = {
        id: data.id,
        value: data.value * 2
    };

    emitter.emit('dataProcessed', processed);
});


emitter.on('dataProcessed', async (data) => {
    console.log("dataProcessed →", data);

    fs.writeFile('result.txt', JSON.stringify(data), (err) => {
        if (err) {
            console.log("Error saving file");
        } else {
            console.log("dataSaved → written to result.txt");
        }
    });
});


emitter.on('dataInvalid', () => {
    console.log("dataInvalid → validation failed");
});


emitter.emit('dataReceived', { id: 1, value: 42 });