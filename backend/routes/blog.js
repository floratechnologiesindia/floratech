import express from 'express';
import { body, validationResult } from 'express-validator';
import BlogPost from '../models/BlogPost.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const posts = await BlogPost.find({ archived: { $ne: true } }).sort({ publishedAt: -1 });
  res.json(posts);
});

router.get('/:slug', async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug, archived: { $ne: true } });
  if (!post) return res.status(404).json({ message: 'Blog post not found' });
  res.json(post);
});

router.post('/', protect,
  body('title').notEmpty(),
  body('slug').notEmpty(),
  body('excerpt').notEmpty(),
  body('content').notEmpty(),
  body('featuredImage').optional().isString(),
  body('featuredImageAlt').optional().isString(),
  body('metaTitle').optional().isString().isLength({ max: 70 }),
  body('metaDescription').optional().isString().isLength({ max: 320 }),
  body('noIndex').optional().isBoolean(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const post = new BlogPost(req.body);
    await post.save();
    res.status(201).json(post);
  }
);

router.put('/:id', protect,
  body('featuredImage').optional().isString(),
  body('featuredImageAlt').optional().isString(),
  body('metaTitle').optional().isString().isLength({ max: 70 }),
  body('metaDescription').optional().isString().isLength({ max: 320 }),
  body('noIndex').optional().isBoolean(),
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!post) return res.status(404).json({ message: 'Blog post not found' });
  res.json(post);
});

router.delete('/:id', protect, async (req, res) => {
  const post = await BlogPost.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).json({ message: 'Blog post not found' });
  res.json({ message: 'Blog post deleted' });
});

router.patch('/:id/archive', protect, body('archived').optional().isBoolean(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const archived = typeof req.body.archived === 'boolean' ? req.body.archived : true;
  const post = await BlogPost.findByIdAndUpdate(req.params.id, { archived }, { new: true });
  if (!post) return res.status(404).json({ message: 'Blog post not found' });
  res.json(post);
});

export default router;
