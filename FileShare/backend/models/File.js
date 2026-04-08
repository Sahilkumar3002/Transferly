const mongoose = require('mongoose');

// This schema stores only file METADATA.
// The actual file binary data (chunks) is stored in MongoDB GridFS.
const fileSchema = new mongoose.Schema({
    filename:     { type: String, required: true },
    uuid:         { type: String, required: true },
    gridfsId:     { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to GridFS file
    size:         { type: Number, required: true },
    mimetype:     { type: String, default: 'application/octet-stream' },
    downloadCount:{ type: Number, default: 0 },
    createdAt:    { type: Date, default: Date.now, expires: 86400 } // TTL: auto-delete after 24 hours
});

module.exports = mongoose.model('File', fileSchema);
