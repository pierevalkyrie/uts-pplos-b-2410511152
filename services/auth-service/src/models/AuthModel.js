const pool = require('../config/db');

class AuthModel {
    static async createUser(id, name, email, hashedPassword) {
        const query = 'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)';
        return await pool.query(query, [id, name, email, hashedPassword]);
    }

    static async getUserByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await pool.query(query, [email]);
        return rows[0];
    }
}

module.exports = AuthModel;