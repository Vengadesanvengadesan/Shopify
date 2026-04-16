const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

router.get('/', productController.getProducts);

// Protected route
router.post('/', auth, productController.createProduct);

module.exports = router;