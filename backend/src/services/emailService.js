// const nodemailer = require('nodemailer');

// class EmailService {
//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       secure: false, // true for 465, false for other ports
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });
//   }

//   // Send email
//   async sendEmail(to, subject, html) {
//     const mailOptions = {
//       from: `"Ethiopian Law Guidance System" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html
//     };

//     try {
//       const info = await this.transporter.sendMail(mailOptions);
//       console.log('Email sent:', info.messageId);
//       return info;
//     } catch (error) {
//       console.error('Email sending failed:', error);
//       throw error;
//     }
//   }

//   // Send welcome email
//   async sendWelcomeEmail(to, name) {
//     const subject = 'Welcome to Ethiopian Law Guidance System';
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h1 style="color: #1a4b8c;">Welcome to ELGS!</h1>
//         <p>Dear ${name},</p>
//         <p>Thank you for registering with the Ethiopian Law Guidance System. We're excited to help you access Ethiopian legal information with ease.</p>
//         <p>With your account, you can:</p>
//         <ul>
//           <li>Search laws in English, Amharic, and Afaan Oromoo</li>
//           <li>Save bookmarks for quick access</li>
//           <li>Chat with our AI assistant</li>
//           <li>Track your learning progress</li>
//         </ul>
//         <p>Click the button below to verify your email address:</p>
//         <a href="${process.env.FRONTEND_URL}/verify-email/${to}" style="display: inline-block; padding: 10px 20px; background-color: #1a4b8c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify Email</a>
//         <p>If you have any questions, feel free to contact our support team.</p>
//         <p>Best regards,<br>The ELGS Team</p>
//       </div>
//     `;

//     return this.sendEmail(to, subject, html);
//   }

//   // Send password reset email
//   async sendPasswordResetEmail(to, resetToken) {
//     const subject = 'Password Reset Request';
//     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h1 style="color: #1a4b8c;">Password Reset Request</h1>
//         <p>Dear User,</p>
//         <p>We received a request to reset your password. Click the button below to create a new password:</p>
//         <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #1a4b8c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
//         <p>This link will expire in 10 minutes.</p>
//         <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
//         <p>Best regards,<br>The ELGS Team</p>
//       </div>
//     `;

//     return this.sendEmail(to, subject, html);
//   }

//   // Send email verification
//   async sendVerificationEmail(to, verificationToken) {
//     const subject = 'Verify Your Email';
//     const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h1 style="color: #1a4b8c;">Verify Your Email Address</h1>
//         <p>Dear User ,</p>
//         <p>Please verify your email address to activate your account:</p>
//         <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #1a4b8c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify Email</a>
//         <p>This link will expire in 24 hours.</p>
//         <p>If you didn't create an account, please ignore this email.</p>
//         <p>Best regards,<br>The ELGS Team</p>
//       </div>
//     `;

//     return this.sendEmail(to, subject, html);
//   }

//   // Send bookmark export
//   async sendBookmarkExport(to, bookmarks) {
//     const subject = 'Your ELGS Bookmarks Export';
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h1 style="color: #1a4b8c;">Your Bookmarks Export</h1>
//         <p>Dear User,</p>
//         <p>Your bookmarks have been exported. Please find them attached.</p>
//         <p>Total bookmarks: ${bookmarks.length}</p>
//         <p>Best regards,<br>The ELGS Team</p>
//       </div>
//     `;

//     return this.sendEmail(to, subject, html);
//   }

//   // Send contact form
//   async sendContactForm(name, email, message) {
//     const subject = 'New Contact Form Submission';
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h1 style="color: #1a4b8c;">New Contact Form Submission</h1>
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Message:</strong></p>
//         <p>${message}</p>
//       </div>
//     `;

//     return this.sendEmail(process.env.EMAIL_USER, subject, html);
//   }
// }

// module.exports = new EmailService();



const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Send email
  async sendEmail(to, subject, html) {
    const mailOptions = {
      from: `"Ethiopian Law Guidance System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent:", info.messageId);
      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  }

  // Send welcome email
  async sendWelcomeEmail(to, name) {
    const subject = "Welcome to Ethiopian Law Guidance System";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #285F6F;">Welcome to ELGS!</h1>
        <p>Dear <strong>${name}</strong>,</p>

        <p>
        Thank you for registering with the Ethiopian Law Guidance System.
        We're excited to help you access Ethiopian legal information with ease.
        </p>

        <p>With your account, you can:</p>
        <ul>
          <li>Search laws in English, Amharic, and Afaan Oromoo</li>
          <li>Save bookmarks for quick access</li>
          <li>Chat with our AI assistant</li>
          <li>Track your learning progress</li>
        </ul>

        <p>Your account has been created successfully.</p>

        <p>Best regards,<br>The ELGS Team</p>
      </div>
    `;

    return this.sendEmail(to, subject, html);
  }

  // Send password reset email
  async sendPasswordResetEmail(to, name, resetToken) {
    const subject = "Password Reset Request";

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #B22222;">Password Reset Request</h1>

        <p>Dear <strong>${name}</strong>,</p>

        <p>
        We received a request to reset your password.
        Click the button below to create a new password:
        </p>

        <a href="${resetUrl}"
        style="display:inline-block;padding:10px 20px;background:#285F6F;color:white;text-decoration:none;border-radius:5px;margin:20px 0;">
        Reset Password
        </a>

        <p>This link will expire in 10 minutes.</p>

        <p>If you didn't request this, please ignore this email.</p>

        <p>Best regards,<br>The ELGS Team</p>
      </div>
    `;

    return this.sendEmail(to, subject, html);
  }

  // Send email verification
  async sendVerificationEmail(to, name, verificationToken) {
    const subject = "Verify Your Email";

    const verificationUrl =
      `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #285F6F;">Verify Your Email Address</h1>

        <p>Dear <strong>${name}</strong>,</p>

        <p>Please verify your email address to activate your account:</p>

        <a href="${verificationUrl}"
        style="display:inline-block;padding:10px 20px;background:#B22222;color:white;text-decoration:none;border-radius:5px;margin:20px 0;">
        Verify Email
        </a>

        <p>This link will expire in 24 hours.</p>

        <p>If you didn't create an account, please ignore this email.</p>

        <p>Best regards,<br>The ELGS Team</p>
      </div>
    `;

    return this.sendEmail(to, subject, html);
  }

  // Send bookmark export
  async sendBookmarkExport(to, name, bookmarks) {
    const subject = "Your ELGS Bookmarks Export";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #285F6F;">Your Bookmarks Export</h1>

        <p>Dear <strong>${name}</strong>,</p>

        <p>Your bookmarks have been exported successfully.</p>

        <p>Total bookmarks: <strong>${bookmarks.length}</strong></p>

        <p>You can import this data to restore your bookmarks anytime.</p>

        <p>Best regards,<br>The ELGS Team</p>
      </div>
    `;

    return this.sendEmail(to, subject, html);
  }

  // Send contact form
  async sendContactForm(name, email, message) {
    const subject = "New Contact Form Submission";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width:600px;margin:0 auto;">
        <h1 style="color:#B22222;">New Contact Form Submission</h1>

        <p><strong>Name:</strong> ${name}</p>

        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Message:</strong></p>

        <p style="background:#f5f5f5;padding:15px;border-radius:5px;">${message}</p>
      </div>
    `;

    return this.sendEmail(process.env.EMAIL_USER, subject, html);
  }
}

module.exports = new EmailService();