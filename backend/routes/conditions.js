const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Condition = require("../models/condition");

// JWT Secret Key
const JWT_SECRET = "health-tracker-secret-key";

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

// Get all conditions for the authenticated user
router.get("/", authenticate, async (req, res) => {
  try {
    const conditions = await Condition.find({ userId: req.userId });
    res.status(200).json(conditions);
  } catch (error) {
    console.error("Error fetching conditions:", error);
    res.status(500).json({ error: "Failed to fetch conditions" });
  }
});

// Get a specific condition
router.get("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure user can only view their own conditions
    const condition = await Condition.findOne({ _id: id, userId: req.userId });
    if (!condition) {
      return res.status(404).json({ error: "Condition not found" });
    }
    
    res.status(200).json(condition);
  } catch (error) {
    console.error("Error fetching condition:", error);
    res.status(500).json({ error: "Failed to fetch condition" });
  }
});

// Create a new condition
router.post("/", authenticate, async (req, res) => {
  try {
    const { name, type, severity, diagnosedDate, isActive, notes } = req.body;
    
    const newCondition = new Condition({
      userId: req.userId,
      name,
      type,
      severity,
      diagnosedDate,
      isActive,
      notes
    });
    
    await newCondition.save();
    res.status(201).json(newCondition);
  } catch (error) {
    console.error("Error creating condition:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: Object.values(error.errors).map(e => e.message).join(", ") });
    }
    res.status(500).json({ error: "Failed to create condition" });
  }
});

// Update a condition
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Ensure user can only update their own conditions
    const condition = await Condition.findOne({ _id: id, userId: req.userId });
    if (!condition) {
      return res.status(404).json({ error: "Condition not found" });
    }
    
    // Update condition fields
    Object.keys(updates).forEach(key => {
      condition[key] = updates[key];
    });
    
    await condition.save();
    res.status(200).json(condition);
  } catch (error) {
    console.error("Error updating condition:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: Object.values(error.errors).map(e => e.message).join(", ") });
    }
    res.status(500).json({ error: "Failed to update condition" });
  }
});

// Delete a condition
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure user can only delete their own conditions
    const condition = await Condition.findOneAndDelete({ _id: id, userId: req.userId });
    if (!condition) {
      return res.status(404).json({ error: "Condition not found" });
    }
    
    res.status(200).json({ message: "Condition deleted successfully" });
  } catch (error) {
    console.error("Error deleting condition:", error);
    res.status(500).json({ error: "Failed to delete condition" });
  }
});

module.exports = router; 