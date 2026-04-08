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
// On Render (persistent server) we connect once at startup, not lazily.
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB + GridFS connected');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); // Crash + restart on Render if DB is unreachable
    }
};

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/files', require('./routes/files'));

app.get('/', (req, res) => res.json({
    status: 'Transferly API running',
    storage: 'MongoDB GridFS (streaming + buffer)',
    host: 'Render'
}));

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});

module.exports = app;
