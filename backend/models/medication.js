const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Medication name is required"],
      trim: true,
    },
    dosage: {
      type: String,
      required: [true, "Dosage is required"],
      trim: true,
    },
    frequency: {
      type: String,
      required: [true, "Frequency is required"],
      enum: ["daily", "twice-daily", "weekly", "monthly", "as-needed"],
      default: "daily",
    },
    type: {
      type: String,
      required: [true, "Medication type is required"],
      enum: ["pill", "capsule", "liquid", "injection"],
      default: "pill",
    },
    instructions: {
      type: String,
      trim: true,
    },
    startDate: {
      type: String,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: String,
    },
    reminderTime: {
      type: String,
      required: [true, "Reminder time is required"],
    },
    status: {
      type: String,
      enum: ["due", "taken", "missed"],
      default: "due",
    },
    active: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medication", medicationSchema); 