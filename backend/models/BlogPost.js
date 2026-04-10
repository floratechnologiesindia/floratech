import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: 'Flora Technologies' },
    tags: [{ type: String }],
    publishedAt: { type: Date, default: Date.now },
    featuredImage: { type: String },
    featuredImageAlt: { type: String },
    archived: { type: Boolean, default: false },
    metaTitle: { type: String },
    metaDescription: { type: String },
    noIndex: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);
