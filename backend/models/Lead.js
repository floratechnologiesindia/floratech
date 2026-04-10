import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  message: { type: String },
  source: { type: String, default: 'Website' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Lead || mongoose.model('Lead', leadSchema);
