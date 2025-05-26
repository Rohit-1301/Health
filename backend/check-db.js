const mongoose = require("mongoose");

// MongoDB connection string (from your server.js file)
const MONGODB_URI = "PASTE_YOUR_MONGODB_CONNECTION_STRING_HERE";

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
    checkAppointments();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Function to check appointments
async function checkAppointments() {
  try {
    // Get the Appointment model - safely handle if it's already registered
    let Appointment;
    try {
      Appointment = mongoose.model("Appointment");
    } catch (e) {
      // If not registered yet, create it with a flexible schema
      Appointment = mongoose.model("Appointment", new mongoose.Schema({}, { strict: false }));
    }
    
    // Count appointments
    const count = await Appointment.countDocuments();
    console.log(`Found ${count} appointments in the database`);
    
    if (count > 0) {
      // List all appointments
      const appointments = await Appointment.find().limit(10);
      console.log("\nHere are the first 10 appointments (or all if less than 10):");
      appointments.forEach((appointment, index) => {
        console.log(`\n--- Appointment ${index + 1} ---`);
        console.log(JSON.stringify(appointment, null, 2));
      });
    }

    // Also check users for reference
    let User;
    try {
      User = mongoose.model("User");
    } catch (e) {
      User = mongoose.model("User", new mongoose.Schema({}, { strict: false }));
    }
    
    const userCount = await User.countDocuments();
    console.log(`\nFound ${userCount} users in the database`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  } catch (error) {
    console.error("Error checking appointments:", error);
  } finally {
    process.exit(0);
  }
} 