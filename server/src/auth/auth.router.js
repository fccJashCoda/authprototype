const express = require('express');

const authController = require('./auth.controller');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({ message: 'auth router' });
});

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);

module.exports = router;
