
function withTimeout(promise, timeout) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject("Timed out");
        }, timeout);

        promise
            .then((res) => {
                clearTimeout(timer);
                resolve(res);
            })
            .catch((err) => {
                clearTimeout(timer);
                reject(err);
            });
    });
}


function createFetch(name, delay) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(name);
        }, delay);
    });
}


const delays = [400, 1200, 800, 2500, 600];


const promises = delays.map((delay, index) => {
    return withTimeout(
        createFetch(`fetch${index + 1}`, delay),
        1000
    );
});

Promise.allSettled(promises).then((results) => {
    const fulfilled = [];
    const timedOut = [];

    results.forEach((result, index) => {
        if (result.status === "fulfilled") {
            fulfilled.push(result.value);
        } else {
            timedOut.push(`fetch${index + 1}`);
        }
    });

    console.log("Fulfilled:", fulfilled.join(", "));
    console.log("Timed out:", timedOut.join(", "));
});