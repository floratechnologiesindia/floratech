import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    client: { type: String, required: true },
    industry: { type: String, required: true },
    imageUrl: { type: String },
    imageAlt: { type: String },
    summary: { type: String, required: true },
    challenges: { type: String, required: true },
    solution: { type: String, required: true },
    results: { type: String, required: true },
    tags: [{ type: String }],
    published: { type: Boolean, default: true },
    archived: { type: Boolean, default: false },
    metaTitle: { type: String },
    metaDescription: { type: String },
    noIndex: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);
