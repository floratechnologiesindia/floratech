import express from 'express';
import { body, validationResult } from 'express-validator';
import Portfolio from '../models/Portfolio.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await Portfolio.find({ archived: { $ne: true } }).sort({ createdAt: -1 });
  res.json(items);
});

router.get('/:slug', async (req, res) => {
  const item = await Portfolio.findOne({ slug: req.params.slug, archived: { $ne: true } });
  if (!item) return res.status(404).json({ message: 'Portfolio item not found' });
  res.json(item);
});

router.post('/', protect,
  body('title').notEmpty(),
  body('slug').notEmpty(),
  body('client').notEmpty(),
  body('industry').notEmpty(),
  body('imageUrl').optional().isString(),
  body('imageAlt').optional().isString(),
  body('summary').notEmpty(),
  body('challenges').notEmpty(),
  body('solution').notEmpty(),
  body('results').notEmpty(),
  body('metaTitle').optional().isString().isLength({ max: 70 }),
  body('metaDescription').optional().isString().isLength({ max: 320 }),
  body('noIndex').optional().isBoolean(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const item = new Portfolio(req.body);
    await item.save();
    res.status(201).json(item);
  }
);

router.put('/:id', protect,
  body('imageUrl').optional().isString(),
  body('imageAlt').optional().isString(),
  body('metaTitle').optional().isString().isLength({ max: 70 }),
  body('metaDescription').optional().isString().isLength({ max: 320 }),
  body('noIndex').optional().isBoolean(),
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const item = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Portfolio item not found' });
  res.json(item);
});

router.delete('/:id', protect, async (req, res) => {
  const item = await Portfolio.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Portfolio item not found' });
  res.json({ message: 'Portfolio item deleted' });
});

router.patch('/:id/archive', protect, body('archived').optional().isBoolean(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const archived = typeof req.body.archived === 'boolean' ? req.body.archived : true;
  const item = await Portfolio.findByIdAndUpdate(req.params.id, { archived }, { new: true });
  if (!item) return res.status(404).json({ message: 'Portfolio item not found' });
  res.json(item);
});

export default router;
