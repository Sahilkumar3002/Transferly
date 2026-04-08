const express  = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
require('dotenv').config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || '*'
}));

// ─── MongoDB Connection ───────────────────────────────────────────────────────
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('⚠️ MONGODB_URI is undefined!');
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB + GridFS connected successfully!');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        // We removed process.exit(1) so the server stays alive even if DB fails,
        // allowing us to read the logs and access the health endpoint.
    }
};

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/files', require('./routes/files'));

app.get('/', (req, res) => res.json({
    status: 'Transferly API running',
    storage: 'MongoDB GridFS (streaming + buffer)',
    host: 'Render',
    db_status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
}));

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    // Explicitly bind to 0.0.0.0 for Render compatibility
    app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
});

module.exports = app;
