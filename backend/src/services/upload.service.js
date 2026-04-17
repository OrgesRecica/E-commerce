import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import cloudinary from '../config/cloudinary.js';

const useCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

const LOCAL_ROOT = path.resolve(process.cwd(), 'uploads');

function publicUrlFor(relative) {
  const base = (process.env.PUBLIC_BASE_URL || '').replace(/\/$/, '');
  return `${base}/uploads/${relative.replace(/\\/g, '/')}`;
}

export function uploadBuffer(buffer, folder = 'ecommerce', originalName = 'file') {
  if (useCloudinary) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
        if (err) return reject(err);
        resolve({ url: result.secure_url, publicId: result.public_id });
      });
      stream.end(buffer);
    });
  }

  const dir = path.join(LOCAL_ROOT, folder);
  fs.mkdirSync(dir, { recursive: true });
  const ext = (path.extname(originalName) || '.bin').toLowerCase();
  const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
  const filePath = path.join(dir, name);
  fs.writeFileSync(filePath, buffer);
  const relative = `${folder}/${name}`;
  return Promise.resolve({ url: publicUrlFor(relative), publicId: `local:${relative}` });
}

export async function destroyAsset(publicId) {
  if (!publicId) return;
  if (publicId.startsWith('local:')) {
    const filePath = path.join(LOCAL_ROOT, publicId.slice('local:'.length));
    try {
      await fs.promises.unlink(filePath);
    } catch {}
    return;
  }
  return cloudinary.uploader.destroy(publicId);
}
