const router = require('express').Router();
const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');
const { Readable } = require('stream');
const mongoose = require('mongoose');
const File = require('../models/File');
require('dotenv').config();

// ─── Multer: MemoryStorage ────────────────────────────────────────────────────
// The uploaded file is held in RAM as a Buffer before we stream it to GridFS.
// No disk writes at all.
const upload = multer({
    storage: multer.memoryStorage(), // buffer in RAM
    // No file size limit set here — it's unrestricted
});

// ─── Helper: get the GridFS bucket from the active mongoose connection ────────
// We lazily grab it so it always uses the currently active connection.
const getBucket = () => {
    return new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
    });
};

// ─── Helper: stream a Buffer into GridFS ───────────────────────────────────────
// Returns a Promise that resolves with the new GridFS file ObjectId.
const streamBufferToGridFS = (buffer, filename, mimetype) => {
    return new Promise((resolve, reject) => {
        const bucket = getBucket();

        // Create a Readable stream from the in-memory Buffer
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null); // signal EOF

        // Open an upload stream into GridFS
        const uploadStream = bucket.openUploadStream(filename, {
            contentType: mimetype || 'application/octet-stream',
        });

        readableStream
            .pipe(uploadStream)
            .on('error', reject)
            .on('finish', () => resolve(uploadStream.id)); // ObjectId of the stored file
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/files/upload
// Accepts multipart/form-data, buffers the file in RAM, streams to GridFS,
// then saves lightweight metadata to the File collection.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
    }

    try {
        // req.file.buffer is the entire file as a Node.js Buffer (in RAM)
        const gridfsId = await streamBufferToGridFS(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype
        );

        // Save only the lightweight metadata to MongoDB
        const file = new File({
            filename:  req.file.originalname,
            uuid:      uuidv4(),
            gridfsId:  gridfsId,               // link to the GridFS chunks
            size:      req.file.size,
            mimetype:  req.file.mimetype,
        });

        const saved = await file.save();
        res.json({ file: `${process.env.FRONTEND_URL}/file/${saved.uuid}` });

    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/files/:uuid
// Returns file metadata (name, size, etc.) for the download page.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:uuid', async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        if (!file) return res.status(404).json({ error: 'File not found or expired' });

        res.json({
            uuid:          file.uuid,
            filename:      file.filename,
            size:          file.size,
            mimetype:      file.mimetype,
            downloadCount: file.downloadCount,
            createdAt:     file.createdAt,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching file details' });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/files/download/:uuid
// Streams the file binary from GridFS directly to the browser response.
// No temp files, no full load into memory — pure streaming.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/download/:uuid', async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        if (!file) return res.status(404).json({ error: 'File not found or expired' });

        // Increment download counter
        await File.updateOne({ uuid: req.params.uuid }, { $inc: { downloadCount: 1 } });

        // Set headers to force browser to download (not preview)
        res.set('Content-Type', file.mimetype || 'application/octet-stream');
        res.set('Content-Disposition', `attachment; filename="${encodeURIComponent(file.filename)}"`);
        res.set('Content-Length', file.size);

        const bucket = getBucket();

        // Open a download stream from GridFS and pipe it straight to the HTTP response
        // GridFS streams the file in 255KB chunks — never loads the whole file into RAM
        const downloadStream = bucket.openDownloadStream(file.gridfsId);

        downloadStream.on('error', (err) => {
            console.error('GridFS stream error:', err);
            if (!res.headersSent) res.status(500).json({ error: 'Error streaming file' });
        });

        downloadStream.pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error downloading file' });
    }
});

module.exports = router;
