import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    details: { type: String, required: true },
    imageUrl: { type: String },
    imageAlt: { type: String },
    archived: { type: Boolean, default: false },
    features: [{ type: String }],
    category: { type: String, default: 'General' },
    metaTitle: { type: String },
    metaDescription: { type: String },
    noIndex: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model('Service', serviceSchema);
