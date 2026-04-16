

exports.getUsers = (req, res) => {
    console.log("Controller: GET users");

    res.json({
        message: "Users fetched successfully"
    });
};

exports.createUser = (req, res) => {
    console.log("Controller: CREATE user");

    res.status(201).json({
        message: "User created successfully"
    });
};