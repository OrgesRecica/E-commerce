import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  BCRYPT_ROUNDS,
  LOGIN_LOCK_MINUTES,
  LOGIN_MAX_FAILED_ATTEMPTS,
} from '../config/security.js';
import { randomToken, sha256 } from '../utils/crypto.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    passwordChangedAt: { type: Date },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    emailVerified: { type: Boolean, default: false },
    emailVerificationTokenHash: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    loginFailedAttempts: { type: Number, default: 0, select: false },
    loginLockUntil: { type: Date, default: null, select: false },
    lastLoginAt: { type: Date },
    address: {
      line1: { type: String, trim: true, maxlength: 160 },
      city: { type: String, trim: true, maxlength: 80 },
      postalCode: { type: String, trim: true, maxlength: 32 },
      country: { type: String, trim: true, maxlength: 80 },
    },
  },
  {
    timestamps: true,
    strict: 'throw',
    toJSON: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        delete ret.emailVerificationTokenHash;
        delete ret.emailVerificationExpires;
        delete ret.loginFailedAttempts;
        delete ret.loginLockUntil;
        return ret;
      },
    },
  }
);

userSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, BCRYPT_ROUNDS);
  if (!this.isNew) this.passwordChangedAt = new Date(Date.now() - 1000);
};

userSchema.methods.verifyPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.methods.isLoginLocked = function () {
  return Boolean(this.loginLockUntil && this.loginLockUntil > new Date());
};

userSchema.methods.recordFailedLogin = async function () {
  this.loginFailedAttempts = (this.loginFailedAttempts || 0) + 1;
  if (this.loginFailedAttempts >= LOGIN_MAX_FAILED_ATTEMPTS) {
    this.loginLockUntil = new Date(Date.now() + LOGIN_LOCK_MINUTES * 60 * 1000);
  }
  await this.save({ validateBeforeSave: false });
};

userSchema.methods.resetLoginFailures = async function () {
  this.loginFailedAttempts = 0;
  this.loginLockUntil = null;
  this.lastLoginAt = new Date();
  await this.save({ validateBeforeSave: false });
};

userSchema.methods.createEmailVerificationToken = function () {
  const token = randomToken(32);
  this.emailVerificationTokenHash = sha256(token);
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return token;
};

userSchema.methods.changedPasswordAfter = function (jwtIssuedAtSeconds) {
  if (!this.passwordChangedAt) return false;
  return Math.floor(this.passwordChangedAt.getTime() / 1000) > jwtIssuedAtSeconds;
};

export default mongoose.model('User', userSchema);
