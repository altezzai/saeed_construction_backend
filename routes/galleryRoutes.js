const express = require("express");
const galleryController = require("../controllers/galleryController");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const { handleMulterError } = require("../utils/errorHandling");
const { upload } = require("../middleware/uploadMiddleware");

// router.post('/',authenticateToken, galleryController.createGalleryItem);
router.post(
  "/",
  authenticateToken,
  handleMulterError(upload),
  galleryController.createImage
);

router.get("/", galleryController.getAllGalleryItems);
router.get("/:id", galleryController.getGalleryItemById);
router.put(
  "/:id",
  authenticateToken,
  handleMulterError(upload),
  galleryController.updateGalleryItem
);
router.delete("/:id", authenticateToken, galleryController.deleteGalleryItem);

module.exports = router;
