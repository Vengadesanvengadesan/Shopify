// routes/userRoutes.js

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// Routes
router.get('/', userController.getUsers);
router.post('/', userController.createUser);

module.exports = router;