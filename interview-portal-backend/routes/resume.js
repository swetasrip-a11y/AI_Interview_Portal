const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate } = require('../middleware/auth');
const db = require('../models/database');
const realtime = require('../realtime');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/resumes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'audio/mpeg',
      'audio/mp3'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF/DOC and audio files are allowed.'));
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit for resumes/audio
});

// Upload resume or audio (supports resume or interview audio)
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.userId;
    const filename = req.file.originalname;
    const filesize = req.file.size;
    const filepath = `/uploads/resumes/${req.file.filename}`;
    const mimetype = req.file.mimetype;

    // Store resume/audio info in database
    const result = await db.run(
      `INSERT INTO resumes (user_id, filename, file_path, size, uploaded_at, status)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
      [userId, filename, filepath, filesize, 'completed']
    );

    const resumeId = result.lastID;

    // Emit realtime event
    const io = realtime.getIO();
    if (io) {
      io.emit('resume:uploaded', { userId, resumeId, filename, file_path: filepath, mimetype });
    }

    res.json({
      message: 'File uploaded successfully',
      resume: {
        id: resumeId,
        filename: filename,
        file_path: filepath,
        size: filesize,
        uploaded_at: new Date().toISOString(),
        status: 'completed'
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user resumes
router.get('/list', authenticate, async (req, res) => {
  try {
    const userId = req.userId;

    const resumes = await db.all(
      `SELECT id, filename, file_path, size, uploaded_at, status
       FROM resumes
       WHERE user_id = ?
       ORDER BY uploaded_at DESC`,
      [userId]
    );

    res.json({
      resumes: resumes || [],
      count: (resumes || []).length
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete resume
router.delete('/delete/:id', authenticate, async (req, res) => {
  try {
    const resumeId = req.params.id;
    const userId = req.userId;

    // First get the file path
    const resume = await db.get(`SELECT file_path FROM resumes WHERE id = ? AND user_id = ?`, [resumeId, userId]);
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    // Delete from database
    await db.run(`DELETE FROM resumes WHERE id = ? AND user_id = ?`, [resumeId, userId]);

    // Delete file from disk
    if (resume.file_path) {
      const filePath = path.join(__dirname, '../', resume.file_path);
      fs.unlink(filePath, (err) => {
        if (err) console.error('File deletion error:', err);
      });
    }

    // Emit realtime event
    const io = realtime.getIO();
    if (io) io.emit('resume:deleted', { userId, resumeId });

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Download resume
router.get('/download/:id', authenticate, async (req, res) => {
  try {
    const resumeId = req.params.id;
    const userId = req.userId;

    const resume = await db.get(`SELECT filename, file_path FROM resumes WHERE id = ? AND user_id = ?`, [resumeId, userId]);
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    const filePath = path.join(__dirname, '../', resume.file_path);
    res.download(filePath, resume.filename, (err) => {
      if (err) console.error('Download error:', err);
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
