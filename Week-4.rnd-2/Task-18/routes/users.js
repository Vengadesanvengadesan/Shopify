// routes/users.js

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.use((req, res, next) => {
    console.log(`User Route: ${req.method} ${req.url}`);
    next();
});


router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;