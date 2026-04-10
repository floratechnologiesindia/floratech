import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import multer from 'multer';
import sharp from 'sharp';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { assertSafePublicUrl } from '../utils/safeRemoteUrl.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.resolve(__dirname, '..', 'uploads');
const MAX_IMPORT_BYTES = 8 * 1024 * 1024;
const IMPORT_UA = 'FloraTechMediaImport/1.0 (+https://floratechnologies.in)';

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

router.post(
  '/import-from-url',
  protect,
  body('url').trim().notEmpty().isString().isLength({ max: 2048 }),
  body('folder').optional().isString(),
  body('maxWidth').optional().isInt({ min: 320, max: 2400 }),
  body('maxHeight').optional().isInt({ min: 320, max: 2400 }),
  body('quality').optional().isInt({ min: 55, max: 95 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    let remote;
    try {
      remote = assertSafePublicUrl(req.body.url);
    } catch (e) {
      return res.status(400).json({ message: e instanceof Error ? e.message : 'Invalid URL' });
    }

    const folder = String(req.body.folder || 'portfolio')
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '');
    const maxWidth = Math.min(Math.max(Number(req.body.maxWidth || 1600), 320), 2400);
    const maxHeight = Math.min(Math.max(Number(req.body.maxHeight || 1600), 320), 2400);
    const quality = Math.min(Math.max(Number(req.body.quality || 82), 55), 95);

    let resFetch;
    try {
      resFetch = await fetch(remote.href, {
        redirect: 'follow',
        headers: {
          Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
          'User-Agent': IMPORT_UA,
        },
        signal: AbortSignal.timeout(25_000),
      });
    } catch {
      return res.status(400).json({ message: 'Could not download image from URL' });
    }

    if (!resFetch.ok) {
      return res.status(400).json({ message: `Image URL returned HTTP ${resFetch.status}` });
    }

    const buf = Buffer.from(await resFetch.arrayBuffer());
    if (buf.length > MAX_IMPORT_BYTES) {
      return res.status(400).json({ message: 'Image is too large' });
    }

    try {
      const meta = await sharp(buf).metadata();
      if (!meta.format || meta.format === 'unknown') {
        return res.status(400).json({ message: 'Downloaded file is not a supported image' });
      }
    } catch {
      return res.status(400).json({ message: 'Downloaded file is not a supported image' });
    }

    const outDir = path.join(uploadsRoot, folder || 'portfolio');
    await fs.mkdir(outDir, { recursive: true });
    const fileName = `${Date.now()}-${crypto.randomUUID()}.webp`;
    const outputPath = path.join(outDir, fileName);

    try {
      await sharp(buf)
        .rotate()
        .resize({
          width: maxWidth,
          height: maxHeight,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality, effort: 6 })
        .toFile(outputPath);
    } catch {
      return res.status(400).json({ message: 'Could not process image' });
    }

    const publicUrl = `/uploads/${folder || 'portfolio'}/${fileName}`;
    return res.status(201).json({ url: publicUrl });
  }
);

export default router;
