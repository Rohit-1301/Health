const mongoose = require("mongoose");

const conditionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Condition name is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Condition type is required"],
      enum: ["condition", "allergy", "chronic"],
      default: "condition",
    },
    severity: {
      type: String,
      required: [true, "Severity level is required"],
      enum: ["mild", "moderate", "severe"],
      default: "moderate",
    },
    diagnosedDate: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      trim: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Condition", conditionSchema); 