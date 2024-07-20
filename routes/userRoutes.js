const express = require('express');
const router = express.Router();
const { signup, login, showUserData, borrowMoney } = require('../controllers/userController');
const auth = require('../middleware/auth');

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

// Show User Data Route
router.get('/user', auth, showUserData);

// Borrow Money Route
router.post('/borrow', auth, borrowMoney);

module.exports = router;
