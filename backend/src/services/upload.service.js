import cloudinary from '../config/cloudinary.js';

export function uploadBuffer(buffer, folder = 'ecommerce') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) return reject(err);
      resolve({ url: result.secure_url, publicId: result.public_id });
    });
    stream.end(buffer);
  });
}

export function destroyAsset(publicId) {
  return cloudinary.uploader.destroy(publicId);
}
