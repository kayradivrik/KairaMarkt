import multer from 'multer';

// Geçerli Cloudinary config: cloud name küçük harf/rakam olmalı (örn. dxyz123). "Root" veya placeholder sayılmaz.
const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
const isValidCloudName = /^[a-z0-9_-]+$/.test(cloudName) && cloudName.length > 2;
const hasCloudinary = isValidCloudName && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;

let storage;
if (hasCloudinary) {
  const { CloudinaryStorage } = await import('multer-storage-cloudinary');
  const cloudinary = (await import('../config/cloudinary.js')).default;
  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'kairamarkt/products',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 800, crop: 'limit' }],
    },
  });
} else {
  storage = multer.memoryStorage();
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/i.test(file.mimetype);
    if (allowed) cb(null, true);
    else cb(new Error('Sadece resim dosyaları yüklenebilir'));
  },
});

export default upload;
