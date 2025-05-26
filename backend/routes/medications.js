const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Medication = require("../models/medication");
const MedicationHistory = require("../models/medicationHistory");

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

// Get all medications for the authenticated user
router.get("/", authenticate, async (req, res) => {
  try {
    const medications = await Medication.find({ userId: req.userId });
    res.status(200).json(medications);
  } catch (error) {
    console.error("Error fetching medications:", error);
    res.status(500).json({ error: "Failed to fetch medications" });
  }
});

// Get medication history for the authenticated user
router.get("/history", authenticate, async (req, res) => {
  try {
    const history = await MedicationHistory.find({ userId: req.userId })
      .populate("medicationId")
      .sort({ date: -1, time: -1 });
    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching medication history:", error);
    res.status(500).json({ error: "Failed to fetch medication history" });
  }
});

// Create a new medication
router.post("/", authenticate, async (req, res) => {
  try {
    const { name, dosage, frequency, type, instructions, startDate, endDate, reminderTime } = req.body;
    
    const newMedication = new Medication({
      userId: req.userId,
      name,
      dosage,
      frequency,
      type,
      instructions,
      startDate,
      endDate,
      reminderTime,
      status: "due",
      active: true
    });
    
    await newMedication.save();
    res.status(201).json(newMedication);
  } catch (error) {
    console.error("Error creating medication:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: Object.values(error.errors).map(e => e.message).join(", ") });
    }
    res.status(500).json({ error: "Failed to create medication" });
  }
});

// Update a medication
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Ensure user can only update their own medications
    const medication = await Medication.findOne({ _id: id, userId: req.userId });
    if (!medication) {
      return res.status(404).json({ error: "Medication not found" });
    }
    
    Object.keys(updates).forEach(key => {
      medication[key] = updates[key];
    });
    
    await medication.save();
    res.status(200).json(medication);
  } catch (error) {
    console.error("Error updating medication:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: Object.values(error.errors).map(e => e.message).join(", ") });
    }
    res.status(500).json({ error: "Failed to update medication" });
  }
});

// Delete a medication
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure user can only delete their own medications
    const medication = await Medication.findOneAndDelete({ _id: id, userId: req.userId });
    if (!medication) {
      return res.status(404).json({ error: "Medication not found" });
    }
    
    // Delete all history entries for this medication
    await MedicationHistory.deleteMany({ medicationId: id, userId: req.userId });
    
    res.status(200).json({ message: "Medication deleted successfully" });
  } catch (error) {
    console.error("Error deleting medication:", error);
    res.status(500).json({ error: "Failed to delete medication" });
  }
});

// Mark medication as taken
router.post("/:id/taken", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure user can only mark their own medications
    const medication = await Medication.findOne({ _id: id, userId: req.userId });
    if (!medication) {
      return res.status(404).json({ error: "Medication not found" });
    }
    
    // Update medication status
    medication.status = "taken";
    await medication.save();
    
    // Create history entry
    const now = new Date();
    const newHistory = new MedicationHistory({
      userId: req.userId,
      medicationId: id,
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().split(" ")[0].substring(0, 5),
      status: "taken"
    });
    
    await newHistory.save();
    
    res.status(200).json({ medication, history: newHistory });
  } catch (error) {
    console.error("Error marking medication as taken:", error);
    res.status(500).json({ error: "Failed to mark medication as taken" });
  }
});

module.exports = router; 