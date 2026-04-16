let products = [];

exports.getProducts = (req, res) => {
    console.log("GET Products");

    res.json({
        success: true,
        data: products
    });
};

exports.createProduct = (req, res) => {
    const { name, price } = req.body;

    if (!name || typeof price !== "number") {
        return res.status(400).json({
            success: false,
            message: "Valid name and price required"
        });
    }

    const newProduct = {
        id: Date.now(),
        name,
        price
    };

    products.push(newProduct);

    res.status(201).json({
        success: true,
        message: "Product created",
        data: newProduct
    });
};