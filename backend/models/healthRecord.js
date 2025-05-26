const mongoose = require("mongoose");

const healthRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Record title is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Record type is required"],
      enum: ["lab-result", "prescription", "imaging", "discharge", "vaccination", "other"],
      default: "lab-result",
    },
    provider: {
      type: String,
      required: [true, "Healthcare provider is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Record date is required"],
    },
    notes: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
    },
    fileName: {
      type: String,
    },
    fileType: {
      type: String,
    },
    fileSize: {
      type: Number,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("HealthRecord", healthRecordSchema); 