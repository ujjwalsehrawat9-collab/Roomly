const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "public", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const envCloudName = process.env.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
const envApiKey = process.env.CLOUD_API_KEY || process.env.CLOUDINARY_API_KEY;
const envApiSecret = process.env.CLOUD_API_SECRET || process.env.CLOUDINARY_API_SECRET;
const hasCloudinaryConfig = Boolean(envCloudName && envApiKey && envApiSecret);

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: envCloudName,
    api_key: envApiKey,
    api_secret: envApiSecret,
  });
}

const storage = hasCloudinaryConfig
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "Locasa_DEV",
        allowed_formats: ["png", "jpg", "jpeg"],
      },
    })
  : multer.diskStorage({
      destination: (req, file, cb) => cb(null, uploadDir),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    });

module.exports = {
  cloudinary,
  storage,
  uploadDir,
  hasCloudinaryConfig,
};
