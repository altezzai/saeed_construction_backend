const { Gallery } = require("../models");
const {
  compressAndSaveFile,
  deleteOldFilewithfoldername,
} = require("../middleware/uploadMiddleware");

// Create a new gallery item
exports.createImage = async (req, res) => {
  try {
    const { title, type } = req.body;
    const image = req.file ? `${req.file.filename}` : null;
    let compressedFile;
    if (req.file) {
      const uploadPath = "uploads/gallery/";
      compressedFile = await compressAndSaveFile(req.file, uploadPath);
    }

    const newImage = await Gallery.create({
      title,
      image: compressedFile.fileName,
      type,
    });

    res.status(201).json({ message: "Image uploaded", data: newImage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all gallery items
exports.getAllGalleryItems = async (req, res) => {
  try {
    const galleryItems = await Gallery.findAll({
      order: [["id", "DESC"]],
    });
    res.json(galleryItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single gallery item by ID
exports.getGalleryItemById = async (req, res) => {
  try {
    const galleryItem = await Gallery.findByPk(req.params.id);
    if (!galleryItem)
      return res.status(404).json({ error: "Gallery item not found" });
    res.json(galleryItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get all gallery items by type
exports.getGalleryItemsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const galleryItems = await Gallery.findAll({
      where: { type },
      order: [["id", "DESC"]],
    });
    res.json(galleryItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Update a gallery item
exports.updateGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findByPk(req.params.id);
    if (!galleryItem)
      return res.status(404).json({ error: "Gallery item not found" });

    const { title, type } = req.body;

    let compressedFile = galleryItem.image;
    if (req.file) {
      const uploadPath = "uploads/gallery/";
      await deleteOldFilewithfoldername(compressedFile, "gallery"); // delete old file
      compressedFile = await compressAndSaveFile(req.file, uploadPath);
    }

    await galleryItem.update({ title, image: compressedFile.fileName, type });

    res.json(galleryItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a gallery item
exports.deleteGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findByPk(req.params.id);
    if (!galleryItem)
      return res.status(404).json({ error: "Gallery item not found" });

    await galleryItem.destroy();
    res.json({ message: "Gallery item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
