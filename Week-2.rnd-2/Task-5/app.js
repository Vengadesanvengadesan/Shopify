const http = require('http');


function unstableDB() {
    return new Promise((resolve, reject) => {
        const fail = Math.random() < 0.7;

        if (fail) {
            reject("DB Error");
        } else {
            resolve({ source: "database", data: [1, 2, 3] });
        }
    });
}

function fallbackData() {
    return { source: "cache", data: ["A", "B", "C"] };
}


function fetchWithRetry(attempt = 1) {
    return new Promise((resolve, reject) => {

        unstableDB()
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                if (attempt < 3) {
                    const delays = [500, 1000, 2000];
                    console.log(`Attempt ${attempt} failed — retrying in ${delays[attempt - 1]}ms`);

                    setTimeout(() => {
                        resolve(fetchWithRetry(attempt + 1));
                    }, delays[attempt - 1]);

                } else {
                    console.log(`Attempt ${attempt} failed — using fallback`);
                    resolve(fallbackData());
                }
            });
    });
}


const server = http.createServer(async (req, res) => {

    if (req.method === "GET" && req.url === "/data") {

        const result = await fetchWithRetry();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
});


server.listen(3000, () => {
    console.log("Server running on port 3000");
});