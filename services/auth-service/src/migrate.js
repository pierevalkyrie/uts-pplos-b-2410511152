const pool = require('./config/db');

async function runMigration() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255),
                oauth_provider VARCHAR(50) DEFAULT 'local',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Migration auth_db berhasil: tabel users telah dibuat.");
        process.exit(0);
    } catch (error) {
        console.error("Migration gagal:", error);
        process.exit(1);
    }
}

runMigration();