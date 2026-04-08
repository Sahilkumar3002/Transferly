const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    uuid: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now, expires: 86400 } // Auto-delete after 24 hours (86400 seconds)
});

module.exports = mongoose.model('File', fileSchema);
