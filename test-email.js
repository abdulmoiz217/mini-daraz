// Test script to verify email functionality
const nodemailer = require('nodemailer');

// Create transporter with environment variables
let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'test@example.com',
    pass: process.env.EMAIL_PASS || 'testpassword'
  }
});

console.log('Email configuration:');
console.log('- Host:', process.env.SMTP_HOST || 'smtp.gmail.com');
console.log('- Port:', process.env.SMTP_PORT || 587);
console.log('- User:', process.env.EMAIL_USER ? '[CONFIGURED]' : '[NOT SET]');
console.log('- Pass:', process.env.EMAIL_PASS ? '[CONFIGURED]' : '[NOT SET]');

// Test email function
async function testEmail() {
  try {
    // Verify connection
    const verifyResult = await transporter.verify();
    console.log('✓ Email server connection verified');

    // Test sending a sample email
    const mailOptions = {
      from: process.env.EMAIL_USER || 'test@example.com',
      to: 'test@example.com',
      subject: 'Test Email Configuration',
      html: '<h1>Test email sent successfully!</h1><p>This confirms your email configuration is working.</p>'
    };

    console.log('Attempting to send test email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('✓ Test email sent successfully!');
    console.log('Message ID:', result.messageId);
  } catch (error) {
    console.error('✗ Error with email configuration:', error.message);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testEmail();
}

module.exports = { transporter, testEmail };