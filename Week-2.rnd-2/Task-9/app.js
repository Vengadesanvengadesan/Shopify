const fs = require('fs');

function fetchRemoteData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const remote = [
                { id: 1, name: "A" },
                { id: 2, name: "B" }
            ];
            console.log("Remote fetched: 2 records");
            resolve(remote);
        }, 600);
    });
}


function fetchLocalData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const local = [
                { id: 2, name: "B-local" }, 
                { id: 3, name: "C" }
            ];
            console.log("Local fetched: 2 records");
            resolve(local);
        }, 400);
    });
}


function syncData(remote, local) {
    return new Promise((resolve) => {
        setTimeout(() => {

            let map = new Map();
            let conflict = 0;

           
            local.forEach(item => {
                map.set(item.id, item);
            });

           
            remote.forEach(item => {
                if (map.has(item.id)) {
                    conflict++;
                }
                map.set(item.id, item);
            });

            const result = Array.from(map.values());

            console.log(`Synced: ${result.length} records (${conflict} conflict resolved)`);

            resolve(result);
        }, 300);
    });
}

function saveResult(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            fs.writeFile('sync.json', JSON.stringify(data, null, 2), (err) => {
                if (err) return reject(err);

                console.log("Saved to sync.json");
                resolve();
            });
        }, 200);
    });
}

async function runPipeline() {
    try {
       
        const [remote, local] = await Promise.all([
            fetchRemoteData(),
            fetchLocalData()
        ]);

        const synced = await syncData(remote, local);

        await saveResult(synced);

    } catch (err) {
        console.error("Error:", err);
    }
}

runPipeline();