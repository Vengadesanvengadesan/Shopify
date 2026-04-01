const fs = require('fs');

const start = Date.now();
function log(phase) {
    console.log(`[${Date.now() - start}ms] ${phase}`);
}


log('Sync');


process.nextTick(() => log('nextTick'));


Promise.resolve().then(() => log('Promise'));


setTimeout(() => log('setTimeout'), 0);

setImmediate(() => log('setImmediate'));

fs.readFile(__filename, 'utf8', () => log('fs.readFile'));