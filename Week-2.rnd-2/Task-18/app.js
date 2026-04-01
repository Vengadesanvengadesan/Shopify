
const tasks = Array.from({ length: 10 }, (_, i) => i + 1).map(id => async () => {
    const duration = Math.floor(Math.random() * 1000) + 500; // 500-1500ms
    console.log(`Task ${id} started`);
    return new Promise(resolve => setTimeout(() => {
        console.log(`Task ${id} done — ${duration}ms`);
        resolve(duration);
    }, duration));
});


async function limitConcurrency(taskFns, limit) {
    const results = [];
    let index = 0;

    async function next() {
        if (index >= taskFns.length) return;
        const i = index++;
        await taskFns[i]().then(res => results[i] = res);
        await next(); 
    }

    const starters = Array.from({ length: limit }, () => next());
    await Promise.all(starters);
    return results;
}


(async () => {
    console.time('concurrent');
    await limitConcurrency(tasks, 3);
    console.timeEnd('concurrent');

    console.time('sequential');
    for (const t of tasks) {
        await t();
    }
    console.timeEnd('sequential');
})();