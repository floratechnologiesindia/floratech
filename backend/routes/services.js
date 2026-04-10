import express from 'express';
import { body, validationResult } from 'express-validator';
import Service from '../models/Service.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const services = await Service.find({ archived: { $ne: true } }).sort({ createdAt: -1 });
  res.json(services);
});

router.get('/:slug', async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug, archived: { $ne: true } });
  if (!service) return res.status(404).json({ message: 'Service not found' });
  res.json(service);
});

router.post('/', protect,
  body('title').notEmpty(),
  body('slug').notEmpty(),
  body('summary').notEmpty(),
  body('details').notEmpty(),
  body('imageUrl').optional().isString(),
  body('imageAlt').optional().isString(),
  body('metaTitle').optional().isString().isLength({ max: 70 }),
  body('metaDescription').optional().isString().isLength({ max: 320 }),
  body('noIndex').optional().isBoolean(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  }
);

router.put('/:id', protect,
  body('title').notEmpty(),
  body('slug').notEmpty(),
  body('summary').notEmpty(),
  body('details').notEmpty(),
  body('imageUrl').optional().isString(),
  body('imageAlt').optional().isString(),
  body('metaTitle').optional().isString().isLength({ max: 70 }),
  body('metaDescription').optional().isString().isLength({ max: 320 }),
  body('noIndex').optional().isBoolean(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  }
);

router.delete('/:id', protect, async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) return res.status(404).json({ message: 'Service not found' });
  res.json({ message: 'Service deleted' });
});

router.patch('/:id/archive', protect, body('archived').optional().isBoolean(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const archived = typeof req.body.archived === 'boolean' ? req.body.archived : true;
  const service = await Service.findByIdAndUpdate(req.params.id, { archived }, { new: true });
  if (!service) return res.status(404).json({ message: 'Service not found' });
  res.json(service);
});

export default router;
