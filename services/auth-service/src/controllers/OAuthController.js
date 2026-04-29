const axios = require('axios');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const googleLogin = (req, res) => {
    // Redirect user ke halaman login Google
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=profile email`;
    res.redirect(url);
};

const googleCallback = async (req, res) => {
    const { code } = req.query;

    if (!code) return res.status(400).json({ message: "Authorization code not provided" });

    try {
        // 1. Tukar Authorization Code dengan Access Token dari Google
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: process.env.GOOGLE_REDIRECT_URI
        });

        // 2. Gunakan Access Token untuk mendapatkan data user dari Google
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` }
        });

        const { email, name } = userInfoResponse.data;

        // 3. Cek apakah user sudah ada di database kita
        let [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        let user;

        if (rows.length === 0) {
            // Jika belum ada, buat user baru (tanpa password karena OAuth)
            const newId = uuidv4();
            await pool.query(
                'INSERT INTO users (id, name, email, oauth_provider) VALUES (?, ?, ?, ?)', 
                [newId, name, email, 'google']
            );
            user = { id: newId, email };
        } else {
            user = rows[0];
        }

        // 4. Generate JWT Token untuk aplikasi kita sendiri
        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({ 
            message: "OAuth Login Berhasil",
            access_token: token 
        });

    } catch (error) {
        res.status(500).json({ message: "OAuth Flow gagal", error: error.message });
    }
};

module.exports = { googleLogin, googleCallback };