


let users = [];

exports.getUsers = (req, res) => {
    console.log("GET Users");

    res.json({
        success: true,
        data: users
    });
};

exports.createUser = (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            success: false,
            message: "Name and email required"
        });
    }

    const newUser = {
        id: Date.now(),
        name,
        email
    };

    users.push(newUser);

    res.status(201).json({
        success: true,
        message: "User created",
        data: newUser
    });
};