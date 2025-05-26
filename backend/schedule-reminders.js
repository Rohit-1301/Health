const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

console.log('Starting appointment reminder scheduler...');

// Schedule the task to run every day at 8:00 AM
// Format: second(optional) minute hour day-of-month month day-of-week
cron.schedule('0 8 * * *', () => {
  console.log('Running appointment check at:', new Date().toLocaleString());
  
  const scriptPath = path.join(__dirname, 'check-appointments.js');
  
  exec(`node ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing check-appointments.js: ${error.message}`);
      return;
    }
    
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    
    console.log(`Appointment check completed successfully`);
    console.log(stdout);
  });
});

console.log('Reminder scheduler is running. Will check for appointments at 8:00 AM daily.');
console.log('Press Ctrl+C to exit.'); 