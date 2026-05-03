import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    company: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    subject: {
      type: String,
      enum: ['general', 'wholesale', 'custom', 'partnership', 'press'],
      default: 'general',
    },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
