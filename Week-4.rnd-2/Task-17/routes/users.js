const express = require('express');
const router = express.Router();

let users = [
    { id: 1, name: "Sai", email: "sai@mail.com" },
    { id: 2, name: "Arun", email: "arun@mail.com" }
];

router.use((req, res, next) => {
    console.log(`User Route Hit: ${req.method} ${req.url}`);
    next();
});


router.get('/', (req, res) => {
    res.json(users);
});

router.post('/', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            error: "Name and email required"
        });
    }

    const newUser = {
        id: Date.now(),
        name,
        email
    };

    users.push(newUser);

    res.status(201).json({
        message: "User created successfully",
        data: newUser
    });
});


router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            error: "User not found"
        });
    }

    user.name = req.body.name;
    user.email = req.body.email;

    res.json({
        message: "User updated successfully",
        data: user
    });
});


router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "User not found"
        });
    }

    users.splice(index, 1);

    res.json({
        message: "User deleted successfully"
    });
});

module.exports = router;