const express = require('express');
const app = express();

const users = [
    { username: "sai", email: "sai@mail.com", role: "student" },
    { username: "arun", email: "arun@mail.com", role: "admin" },
    { username: "priya", email: "priya@mail.com", role: "student" },
    { username: "kumar", email: "kumar@mail.com", role: "teacher" },
    { username: "divya", email: "divya@mail.com", role: "student" }
];


app.get('/users/:username', (req, res) => {
    const username = req.params.username;

    console.log(`Requested Username: ${username}`);

    if (!username || username.trim() === "") {
        return res.status(400).json({
            error: "Invalid username"
        });
    }

  
    const user = users.find(
        u => u.username.toLowerCase() === username.toLowerCase()
    );

    if (!user) {
        return res.status(404).json({
            error: "User not found"
        });
    }

    res.status(200).json({
        ...user,
        requestTime: new Date()
    });
});


app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});