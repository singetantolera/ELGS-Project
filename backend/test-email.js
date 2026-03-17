require('dotenv').config();
const emailService = require('./src/services/emailService');

async function testEmail() {
  try {
    console.log('🧪 Testing email service...');
    console.log('   EMAIL_USER:', process.env.EMAIL_USER);
    console.log('   EMAIL_PASS length:', process.env.EMAIL_PASS?.length);
    
    await emailService.sendVerificationEmail(
      'your-real-email@gmail.com', // Replace with your actual email
      'test-token-123456'
    );
    
    console.log('✅ Test email sent successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testEmail();