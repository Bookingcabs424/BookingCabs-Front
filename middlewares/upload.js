import multer from "multer";
import path from "path";
import fs from "fs";

// Accept only specific file types
const allowedMimeTypes = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "application/zip",
  "application/x-zip-compressed",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// File filter
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

// Dynamic storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = req.body.folder?.trim() || req.query.folder?.trim() || "documents";
    const uploadPath = path.join("uploads", folder);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
console.log({uploadPath});
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const finalName = `${uniqueSuffix}-${file.originalname}`;

    // Save full relative path to req.body or req.filePath for later use
    const folder = req.body.folder || req.query.folder || "documents";
    const relativePath = path.join("uploads", folder, finalName);

    req.uploadedFilePath = relativePath; // ✅ you can now access this in your controller

    cb(null, finalName);
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
  },
});

export default upload;
