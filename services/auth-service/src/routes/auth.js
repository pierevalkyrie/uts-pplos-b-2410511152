const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Endpoint: POST /api/auth/register
router.post('/register', AuthController.register);

// Endpoint: POST /api/auth/login
router.post('/login', AuthController.login);

module.exports = router;