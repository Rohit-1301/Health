const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const appointmentsRoutes = require("./routes/appointments");
const medicationsRoutes = require("./routes/medications");
const healthRecordsRoutes = require("./routes/healthRecords");
const conditionsRoutes = require("./routes/conditions");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(
    "PASTE_YOUR_MONGODB_CONNECTION_STRING_HERE",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/medications", medicationsRoutes);
app.use("/api/health-records", healthRecordsRoutes);
app.use("/api/conditions", conditionsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
