const mongoose = require("mongoose");

const medicationHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    medicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medication",
      required: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    status: {
      type: String,
      enum: ["taken", "missed", "skipped"],
      default: "taken",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicationHistory", medicationHistorySchema); 