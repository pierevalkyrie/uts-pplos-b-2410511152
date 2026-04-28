const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const AuthModel = require('../models/AuthModel');
require('dotenv').config();

const register = async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Bad Request: Semua field harus diisi" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuidv4();

        await AuthModel.createUser(id, name, email, hashedPassword);
        
        res.status(201).json({ message: "User berhasil registrasi" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Conflict: Email sudah terdaftar" });
        }
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await AuthModel.getUserByEmail(email);
        
        if (!user) {
            return res.status(404).json({ message: "Not Found: User tidak ditemukan" });
        }
        
        // Cek password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Unauthorized: Password salah" });
        }

        // Generate Token
        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({ 
            message: "Login berhasil",
            access_token: token 
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = { register, login };