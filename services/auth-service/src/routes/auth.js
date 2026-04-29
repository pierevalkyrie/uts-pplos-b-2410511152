const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const OAuthController = require('../controllers/OAuthController');

// Endpoint: POST /api/auth/register
router.post('/register', AuthController.register);

// Endpoint: POST /api/auth/login
router.post('/login', AuthController.login);

// Google OAuth Routes
router.get('/oauth/google', OAuthController.googleLogin);
router.get('/oauth/google/callback', OAuthController.googleCallback);

module.exports = router;