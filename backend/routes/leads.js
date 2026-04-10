import express from 'express';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import Lead from '../models/Lead.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const leadSubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/', protect, async (req, res) => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  res.json(leads);
});

router.post('/',
  leadSubmitLimiter,
  body('name').notEmpty(),
  body('email').isEmail(),
  body('phone').notEmpty(),
  body('service').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json({ message: 'Lead captured', lead });
  }
);

router.delete('/:id', protect, async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) return res.status(404).json({ message: 'Lead not found' });
  res.json({ message: 'Lead removed' });
});

export default router;
