const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
// const ffmpeg = require("fluent-ffmpeg");

//storage is used to store the file .commonly
const storage = multer.memoryStorage();

//chat file upload
if (!fs.existsSync("uploads/gallery")) {
  fs.mkdirSync("uploads/gallery", { recursive: true });
}
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Increase limit to 50MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif", // Images
      "image/webp",
      "video/mp4",
      "video/mpeg",
      "video/quicktime", // Videos
      // Text Files
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"), false);
    }
  },
}).single("image");

// Function to compress and save the file
const compressAndSaveFile = async (file, uploadPath) => {
  try {
    const date = Date.now() + "-";
    let processedFileName = `${date}${file.originalname}`;
    let processedFile = file.buffer;

    const ext = path.extname(file.originalname).toLowerCase();

    if (file.mimetype.startsWith("image")) {
      // Compress only images
      processedFileName = `${date}${file.originalname.split(".")[0]}.jpg`;
      processedFile = await sharp(file.buffer).jpeg({ quality: 30 }).toBuffer();
    }
    // Other files are saved as-is (PDF, video, Word, Excel)

    // Save file to disk
    const filePath = path.join(uploadPath, processedFileName);
    fs.writeFileSync(filePath, processedFile);

    return {
      fileName: processedFileName,
      filePath: filePath,
    };
  } catch (error) {
    console.error("Error processing file:", error);
    throw new Error("Error processing file");
  }
};
const deleteOldFilewithfoldername = async (filename, foldername) => {
  try {
    if (filename) {
      const filePath = path.join("uploads/" + foldername + "/", filename);
      console.log(filePath);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    }
  } catch (err) {
    console.error("Error cleaning up" + foldername + " files:", err);
  }
};

module.exports = {
  upload,
  compressAndSaveFile,
  deleteOldFilewithfoldername,
};
