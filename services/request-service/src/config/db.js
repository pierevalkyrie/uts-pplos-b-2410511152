const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB terhubung: blood_request_db');
    } catch (error) {
        console.error('Koneksi MongoDB gagal:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;