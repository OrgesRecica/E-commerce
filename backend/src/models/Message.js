import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true },
    company: { type: String, trim: true, maxlength: 120, default: '' },
    phone: { type: String, trim: true, maxlength: 40, default: '' },
    subject: {
      type: String,
      enum: ['general', 'wholesale', 'custom', 'partnership', 'press'],
      default: 'general',
    },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true, strict: 'throw' }
);

export default mongoose.model('Message', messageSchema);
