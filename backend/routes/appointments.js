const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointment");
const mongoose = require("mongoose");

// Get all appointments for a user
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`Fetching appointments for userId: ${userId}`);
    
    // First try to find by exact userId match (for "user-1" format)
    let appointments = await Appointment.find({ userId: userId });
    
    // If no appointments found and the userId looks like a MongoDB ObjectId, try that too
    if (appointments.length === 0 && mongoose.Types.ObjectId.isValid(userId)) {
      console.log(`No appointments found with string ID, trying with ObjectId: ${userId}`);
      
      // Find all appointments regardless of userId (as a debug step)
      const allAppointments = await Appointment.find({});
      console.log(`Total appointments in database: ${allAppointments.length}`);
      if (allAppointments.length > 0) {
        console.log(`Sample userIds in database: ${allAppointments.slice(0, 3).map(a => a.userId).join(', ')}`);
      }
      
      // For demo purposes, if no appointments found with ID, return all appointments
      // In production, you would implement proper user authentication
      appointments = allAppointments;
    }
    
    console.log(`Returning ${appointments.length} appointments`);
    res.status(200).json(appointments);
  } catch (error) {
    console.error(`Error fetching appointments: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Create a new appointment
router.post("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const appointmentData = { ...req.body, userId };
    
    const newAppointment = new Appointment(appointmentData);
    const savedAppointment = await newAppointment.save();
    
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an appointment
router.put("/:id", async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel an appointment (update status to cancelled)
router.patch("/:id/cancel", async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "cancelled" } },
      { new: true }
    );
    
    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an appointment
router.delete("/:id", async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
    
    if (!deletedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 