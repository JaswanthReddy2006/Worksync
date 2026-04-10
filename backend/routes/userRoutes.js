const express = require('express');
const router = express.Router();
const { signupUser, loginUser, getUsers, deleteUser } = require('../controllers/userController.js');

router.post('/signup', signupUser);
router.post('/login', loginUser);

router.delete('/:id', deleteUser);

module.exports = router;
