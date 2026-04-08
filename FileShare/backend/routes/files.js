const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const File = require('../models/File');
require('dotenv').config();

// Setup Multer for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 1024 } }); // 1GB max limit

// POST /api/files/upload
router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).send({ error: 'All fields are required' });

    try {
        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        });
        const response = await file.save();
        res.json({ file: `${process.env.FRONTEND_URL}/file/${response.uuid}` });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Error uploading file' });
    }
});

// GET /api/files/:uuid (file meta details)
router.get('/:uuid', async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        if (!file) return res.status(404).send({ error: 'File not found or expired' });

        res.json({
            uuid: file.uuid,
            filename: file.filename,
            size: file.size,
            downloadCount: file.downloadCount,
            createdAt: file.createdAt
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Error fetching file details' });
    }
});

// GET /api/files/download/:uuid
router.get('/download/:uuid', async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        if (!file) return res.status(404).json({ error: 'File not found or expired' });

        const filePath = `${__dirname}/../${file.path}`;
        res.download(filePath, file.filename); // Stream file to client
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error downloading file' });
    }
});

module.exports = router;
