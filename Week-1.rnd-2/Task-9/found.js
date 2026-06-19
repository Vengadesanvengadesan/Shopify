const { readFile } = require('fs');
const path = require('path');

function Words(callback) {
    const filePath = path.join(__dirname, 'article.txt');

    readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            callback(err, null);
            return;
        }

        const splitWords = data.split(/\s+/);
        let count = 0;

        for (let i = 0; i < splitWords.length; i++) {


            const cleanWord = splitWords[i]
                .toLowerCase()
                .replace(/[^a-z.]/g, '');

            if (cleanWord === "node.js") {
                count++;
            }
        }

        callback(null, count);
    });
}

module.exports = Words;