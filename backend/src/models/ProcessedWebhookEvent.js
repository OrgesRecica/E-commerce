import mongoose from 'mongoose';

const processedWebhookEventSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    type: { type: String, required: true },
    processedAt: { type: Date, default: Date.now },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

processedWebhookEventSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('ProcessedWebhookEvent', processedWebhookEventSchema);
