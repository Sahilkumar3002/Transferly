const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const File = require('../models/File');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup Multer for Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'transferly_uploads',
    resource_type: 'auto', // allows all file types
    public_id: (req, file) => `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
  },
});
const upload = multer({ storage }); // No file size limit

// POST /api/files/register (receives metadata after frontend uploads directly to Cloudinary)
router.post('/register', async (req, res) => {
    const { filename, cloudinaryUrl, size } = req.body;
    
    if (!filename || !cloudinaryUrl) {
        return res.status(400).send({ error: 'Missing required fields' });
    }

    try {
        const file = new File({
            filename: filename,
            uuid: uuidv4(),
            path: cloudinaryUrl,
            size: size || 0
        });
        const response = await file.save();
        res.json({ file: `${process.env.FRONTEND_URL}/file/${response.uuid}` });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Error registering file' });
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

        // Force download via Cloudinary's fl_attachment flag
        let downloadUrl = file.path;
        if (downloadUrl.includes('/upload/')) {
             downloadUrl = downloadUrl.replace('/upload/', '/upload/fl_attachment/');
        }

        res.redirect(downloadUrl); // Redirect to cloudinary URL
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error downloading file' });
    }
});

module.exports = router;
