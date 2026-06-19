const fs = require('fs');
const path=require('path')
const filename=path.join(__dirname,'data.txt')

const readFile = (filename) => {
    return new Promise((resolve, reject) => {
        console.log("Reading file...");
        fs.readFile(filename, 'utf-8', (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
};


const parseContent = async (data) => {
    const lines = data.split('\n');
    const filtered = lines.filter(line => line.trim() !== '');

    console.log(`Parsing ${lines.length} lines, ${lines.length - filtered.length} empty removed`);
    return filtered;
};

const saveProcessed = (lines) => {
    return new Promise((resolve, reject) => {
        fs.writeFile('output.txt', lines.join('\n'), (err) => {
            if (err) reject(err);
            else {
                console.log("Saved to output.txt");
                resolve();
            }
        });
    });
};

const processFile = async (filename) => {
    try {
        const data = await readFile(filename);
        const parsed = await parseContent(data);
        await saveProcessed(parsed);
    } catch (err) {
        console.error("Error:", err);
    }
};


let timeout;

const watchAndProcess = (filename) => {
    fs.watch(filename, (eventType) => {
        if (eventType === 'change') {
            
            clearTimeout(timeout); // clear previous calls

            timeout = setTimeout(() => {
                console.log(`File changed: ${filename}`);
                processFile(filename);
            }, 2000); // delay to avoid duplicate triggers
        }
    });
};

watchAndProcess(filename);


