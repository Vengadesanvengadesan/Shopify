const { writeFileSync } = require('fs');

function saveNote(noteText) {
    writeFileSync('./notes.txt', noteText + '\n', {
        flag: 'a'
    });
}

module.exports = saveNote;