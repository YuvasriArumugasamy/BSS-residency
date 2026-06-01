const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configure Multer for local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/gallery';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

// GET /api/gallery — Get all gallery images
router.get('/', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json({ success: true, images });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// POST /api/gallery/upload — Admin upload image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const { title, category } = req.body;
    const imageUrl = `/uploads/gallery/${req.file.filename}`;

    const newImage = new Gallery({
      title: title || '',
      category: category || 'Other',
      imageUrl
    });

    await newImage.save();
    res.status(201).json({ success: true, image: newImage });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Upload failed', error: err.message });
  }
});

// DELETE /api/gallery/:id — Admin delete image
router.delete('/:id', async (req, res) => {
  try {
    const image = await Gallery.findById(req.id || req.params.id);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    // Delete local file
    const filePath = path.join(__dirname, '..', image.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed', error: err.message });
  }
});

module.exports = router;
