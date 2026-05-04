import mongoose from 'mongoose';

const revokedTokenSchema = new mongoose.Schema(
  {
    jti: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    sessionId: { type: String, index: true },
    type: { type: String, enum: ['access'], default: 'access' },
    reason: { type: String, default: 'logout' },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

revokedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('RevokedToken', revokedTokenSchema);
