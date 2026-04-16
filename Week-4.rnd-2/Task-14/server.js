const express = require('express');
const app = express();

app.use(express.json());


let users = [
    { id: 1, name: "Sai", email: "sai@mail.com" },
    { id: 2, name: "Arun", email: "arun@mail.com" }
];


const validateUser = (user) => {
    return user.name && user.email;
};


app.get('/users', (req, res) => {
    console.log("GET all users");
    res.status(200).json(users);
});


app.post('/users', (req, res) => {
    console.log("CREATE user");

    const { name, email } = req.body;

    if (!validateUser(req.body)) {
        return res.status(400).json({
            error: "Name and email are required"
        });
    }

    const newUser = {
        id: users.length + 1,
        name,
        email
    };

    users.push(newUser);

    res.status(201).json({
        message: "User created successfully",
        data: newUser
    });
});

app.put('/users/:id', (req, res) => {
    console.log("UPDATE user");

    const id = parseInt(req.params.id);
    const { name, email } = req.body;

    if (!validateUser(req.body)) {
        return res.status(400).json({
            error: "Name and email are required"
        });
    }

    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            error: "User not found"
        });
    }

    user.name = name;
    user.email = email;

    res.status(200).json({
        message: "User updated successfully",
        data: user
    });
});

/* -------- DELETE USER -------- */
app.delete('/users/:id', (req, res) => {
    console.log("DELETE user");

    const id = parseInt(req.params.id);

    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "User not found"
        });
    }

    users.splice(index, 1);

    res.status(200).json({
        message: "User deleted successfully"
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