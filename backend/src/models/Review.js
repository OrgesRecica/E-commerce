import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    body: { type: String, trim: true, maxlength: 2000, default: '' },
  },
  { timestamps: true, strict: 'throw' }
);

export default mongoose.model('Review', reviewSchema);
