import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import multer from 'multer';
import sharp from 'sharp';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.resolve(__dirname, '..', 'uploads');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image uploads are allowed'));
      return;
    }
    cb(null, true);
  },
});

router.post('/upload', protect, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const folder = String(req.body.folder || 'misc')
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '');
  const maxWidth = Math.min(Math.max(Number(req.body.maxWidth || 1600), 320), 2400);
  const maxHeight = Math.min(Math.max(Number(req.body.maxHeight || 1600), 320), 2400);
  const quality = Math.min(Math.max(Number(req.body.quality || 82), 55), 95);

  const outDir = path.join(uploadsRoot, folder || 'misc');
  await fs.mkdir(outDir, { recursive: true });

  const fileName = `${Date.now()}-${crypto.randomUUID()}.webp`;
  const outputPath = path.join(outDir, fileName);

  await sharp(req.file.buffer)
    .rotate()
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality, effort: 6 })
    .toFile(outputPath);

  const publicUrl = `/uploads/${folder || 'misc'}/${fileName}`;
  return res.status(201).json({ url: publicUrl });
});

export default router;
