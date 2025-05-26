const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const HealthRecord = require("../models/healthRecord");

// JWT Secret Key
const JWT_SECRET = "health-tracker-secret-key";

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
});

// Middleware to authenticate user
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Get all health records for the authenticated user
router.get("/", authenticate, async (req, res) => {
  try {
    const records = await HealthRecord.find({ userId: req.userId });
    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching health records:", error);
    res.status(500).json({ error: "Failed to fetch health records" });
  }
});

// Get a specific health record
router.get("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure user can only view their own records
    const record = await HealthRecord.findOne({ _id: id, userId: req.userId });
    if (!record) {
      return res.status(404).json({ error: "Health record not found" });
    }
    
    res.status(200).json(record);
  } catch (error) {
    console.error("Error fetching health record:", error);
    res.status(500).json({ error: "Failed to fetch health record" });
  }
});

// Create a new health record
router.post("/", authenticate, upload.single("file"), async (req, res) => {
  try {
    const { title, type, provider, date, notes } = req.body;
    
    const newRecord = new HealthRecord({
      userId: req.userId,
      title,
      type,
      provider,
      date,
      notes
    });
    
    // Add file details if a file was uploaded
    if (req.file) {
      newRecord.fileName = req.file.originalname;
      newRecord.fileType = req.file.mimetype;
      newRecord.fileSize = req.file.size;
      newRecord.fileUrl = `/uploads/${req.file.filename}`;
    }
    
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    console.error("Error creating health record:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: Object.values(error.errors).map(e => e.message).join(", ") });
    }
    res.status(500).json({ error: "Failed to create health record" });
  }
});

// Update a health record
router.put("/:id", authenticate, upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Ensure user can only update their own records
    const record = await HealthRecord.findOne({ _id: id, userId: req.userId });
    if (!record) {
      return res.status(404).json({ error: "Health record not found" });
    }
    
    // Update record fields
    Object.keys(updates).forEach(key => {
      if (key !== "file") {
        record[key] = updates[key];
      }
    });
    
    // Add file details if a file was uploaded
    if (req.file) {
      // Delete old file if it exists
      if (record.fileUrl) {
        const oldFilePath = path.join(__dirname, "..", record.fileUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      
      record.fileName = req.file.originalname;
      record.fileType = req.file.mimetype;
      record.fileSize = req.file.size;
      record.fileUrl = `/uploads/${req.file.filename}`;
    }
    
    await record.save();
    res.status(200).json(record);
  } catch (error) {
    console.error("Error updating health record:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: Object.values(error.errors).map(e => e.message).join(", ") });
    }
    res.status(500).json({ error: "Failed to update health record" });
  }
});

// Delete a health record
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure user can only delete their own records
    const record = await HealthRecord.findOne({ _id: id, userId: req.userId });
    if (!record) {
      return res.status(404).json({ error: "Health record not found" });
    }
    
    // Delete associated file if it exists
    if (record.fileUrl) {
      const filePath = path.join(__dirname, "..", record.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await HealthRecord.deleteOne({ _id: id });
    
    res.status(200).json({ message: "Health record deleted successfully" });
  } catch (error) {
    console.error("Error deleting health record:", error);
    res.status(500).json({ error: "Failed to delete health record" });
  }
});

// Download a health record file
router.get("/:id/download", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure user can only download their own records
    const record = await HealthRecord.findOne({ _id: id, userId: req.userId });
    if (!record) {
      return res.status(404).json({ error: "Health record not found" });
    }
    
    if (!record.fileUrl) {
      return res.status(404).json({ error: "No file associated with this record" });
    }
    
    const filePath = path.join(__dirname, "..", record.fileUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }
    
    res.download(filePath, record.fileName);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ error: "Failed to download file" });
  }
});

module.exports = router; 