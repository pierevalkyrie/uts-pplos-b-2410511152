const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect ke MongoDB
connectDB();

// Routes
const requestRoutes = require('./routes/requests');
app.use('/api/requests', requestRoutes);

app.get('/health', (req, res) => res.status(200).json({ status: "Request Service berjalan normal" }));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Request service running on port ${PORT}`));