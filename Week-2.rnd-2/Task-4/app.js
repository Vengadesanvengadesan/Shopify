function recursiveChain(n, step = 1) {
    if (step > n) {
       
        process.nextTick(() => {
            console.log("nextTick after chain");
        });


        setTimeout(() => {
            console.log("timeout after chain");
        }, 0);
        
            setImmediate(() => {
            console.log("immediate after chain");
        });


        return;
    }

    Promise.resolve()
        .then(() => {
            console.log(`Step ${step}`);
            return recursiveChain(n, step + 1);
        });
}


recursiveChain(5);