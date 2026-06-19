

const countWords = require('./count');

countWords((err, result) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log("Word Count:", result);
});