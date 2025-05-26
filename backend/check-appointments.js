const mongoose = require("mongoose");
const Appointment = require("./models/appointment");
const User = require("./models/user");
// Here we would normally require an email service like nodemailer
// const nodemailer = require("nodemailer");

// Connect to MongoDB
mongoose
  .connect(
  "PASTE_YOUR_MONGODB_CONNECTION_STRING_HERE",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("MongoDB connected");
    checkAppointments();
  })
  .catch((err) => console.error(err));

// Function to check appointments and send reminders
async function checkAppointments() {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Format tomorrow's date to match the appointment date format (YYYY-MM-DD)
    const tomorrowDateStr = tomorrow.toISOString().split('T')[0];
    
    console.log(`Checking for appointments scheduled for: ${tomorrowDateStr}`);
    
    // Find appointments scheduled for tomorrow that have reminders enabled
    const upcomingAppointments = await Appointment.find({
      date: tomorrowDateStr,
      setReminder: true,
      status: { $nin: ["cancelled", "completed"] }
    });
    
    console.log(`Found ${upcomingAppointments.length} appointments that need reminders:`);
    
    // Process each appointment that needs a reminder
    for (const appointment of upcomingAppointments) {
      console.log(`Processing reminder for appointment ${appointment._id}:`);
      console.log(`- User ID: ${appointment.userId}`);
      console.log(`- Doctor: ${appointment.doctorName}`);
      console.log(`- Date: ${appointment.date}`);
      console.log(`- Time: ${appointment.time}`);
      
      try {
        // Find the user to get their contact info
        const user = await User.findOne({ _id: appointment.userId });
        
        if (!user) {
          console.log(`- Warning: User ${appointment.userId} not found`);
          continue;
        }
        
        // Send reminder notification
        await sendReminderNotification(user, appointment);
        
        console.log(`- Reminder sent successfully to ${user.email}`);
      } catch (userError) {
        console.error(`- Error processing user ${appointment.userId}:`, userError);
      }
    }
    
    // Disconnect after checking
    mongoose.disconnect().then(() => {
      console.log("Disconnected from MongoDB");
    });
  } catch (error) {
    console.error("Error checking appointments:", error);
    process.exit(1);
  }
}

// Mock function to send reminder notifications
// In a production app, this would use nodemailer or a service like SendGrid, Twilio, etc.
async function sendReminderNotification(user, appointment) {
  // For demo purposes, we'll just log what would be sent
  console.log("----------------------------------");
  console.log("SENDING REMINDER NOTIFICATION");
  console.log("----------------------------------");
  console.log(`To: ${user.email}`);
  console.log(`Subject: Reminder: Appointment with ${appointment.doctorName} tomorrow`);
  console.log(`Body: `);
  console.log(`Hello ${user.name},`);
  console.log(`This is a reminder about your appointment tomorrow:`);
  console.log(`Doctor: ${appointment.doctorName} (${appointment.specialty})`);
  console.log(`Date: ${appointment.date} at ${appointment.time}`);
  console.log(`Location: ${appointment.location}`);
  console.log(`Reason: ${appointment.reason || "Not specified"}`);
  console.log("----------------------------------");
  
  // In a real implementation, we would send an actual email:
  /*
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Reminder: Appointment with ${appointment.doctorName} tomorrow`,
    html: `
      <h2>Appointment Reminder</h2>
      <p>Hello ${user.name},</p>
      <p>This is a reminder about your appointment tomorrow:</p>
      <ul>
        <li><strong>Doctor:</strong> ${appointment.doctorName} (${appointment.specialty})</li>
        <li><strong>Date:</strong> ${appointment.date} at ${appointment.time}</li>
        <li><strong>Location:</strong> ${appointment.location}</li>
        <li><strong>Reason:</strong> ${appointment.reason || "Not specified"}</li>
      </ul>
      <p>If you need to reschedule, please contact us as soon as possible.</p>
      <p>Thank you,<br>Health Tracker Team</p>
    `
  };
  
  return transporter.sendMail(mailOptions);
  */
  
  // For now just return a resolved promise
  return Promise.resolve();
} 