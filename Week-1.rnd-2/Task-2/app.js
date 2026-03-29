const { readFileSync } = require('fs');

const data = readFileSync('./Task-2/users.txt', 'utf8');

// Split usernames (by space or new line)
const users = data.split(/\s+/);

console.log("User List");

for (let i = 0; i < users.length - 1; i++) {
    console.log(`${i + 1}. ${users[i]}`);
}