// controllers/userController.js

let users = [
    { id: 1, name: "Sai", email: "sai@mail.com" },
    { id: 2, name: "Arun", email: "arun@mail.com" }
];

// GET all users
exports.getUsers = (req, res) => {
    console.log("Controller: GET users");
    res.json(users);
};

// CREATE user
exports.createUser = (req, res) => {
    console.log("Controller: CREATE user");

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
};

// UPDATE user
exports.updateUser = (req, res) => {
    console.log("Controller: UPDATE user");

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
};

// DELETE user
exports.deleteUser = (req, res) => {
    console.log("Controller: DELETE user");

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
};