const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());

// Rate Limiting: Mencegah spam request (Maks 60 request / menit)
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 60000,
    max: process.env.RATE_LIMIT_MAX || 60,
    message: { message: "Terlalu banyak request, coba lagi nanti." }
});
app.use(limiter);

// Middleware Validasi JWT di tingkat Gateway (opsional untuk keamanan ganda)
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Gateway: Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Gateway: Forbidden" });
        req.user = decoded;
        next();
    });
};

// --- ROUTING PROXY ---

// 1. Auth Service Proxy (Semua request diteruskan tanpa validasi token gateway)
app.use('/api/auth', proxy(process.env.AUTH_SERVICE_URL));

// 2. Donor Service Proxy (Contoh: /stocks public, /donors butuh token)
// Endpoint public
app.use('/api/stocks', proxy(process.env.DONOR_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/stocks' + (req.url === '/' ? '' : req.url)
}));

// Endpoint terproteksi
app.use('/api/donors', verifyToken, proxy(process.env.DONOR_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/donors' + (req.url === '/' ? '' : req.url)
}));

// 3. Request Service Proxy (Terproteksi)
app.use('/api/requests', verifyToken, proxy(process.env.REQUEST_SERVICE_URL));

// Health Check Gateway
app.get('/health', (req, res) => {
    res.status(200).json({ status: "API Gateway berjalan normal" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
});