const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

class AuthService {
  // Generate JWT token
  generateToken(userId, role) {
    return jwt.sign(
      { id: userId, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
  }

  // Generate random token
  generateRandomToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Hash token
  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // Create password reset token
  async createPasswordResetToken(email) {
    const user = await User.findOne({ email });
    if (!user) return null;

    const resetToken = this.generateRandomToken();
    user.passwordResetToken = this.hashToken(resetToken);
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    return resetToken;
  }

  // Create email verification token
  async createEmailVerificationToken(userId) {
    const user = await User.findById(userId);
    if (!user) return null;

    const verificationToken = this.generateRandomToken();
    user.emailVerificationToken = this.hashToken(verificationToken);
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save({ validateBeforeSave: false });

    return verificationToken;
  }

  // Verify password reset token
  async verifyPasswordResetToken(token) {
    const hashedToken = this.hashToken(token);
    
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    return user;
  }

  // Verify email token
  async verifyEmailToken(token) {
    const hashedToken = this.hashToken(token);
    
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    return user;
  }

  // Update password
  async updatePassword(userId, newPassword) {
    const user = await User.findById(userId);
    if (!user) return null;

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return user;
  }

  // Verify email
  async verifyEmail(userId) {
    const user = await User.findById(userId);
    if (!user) return null;

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return user;
  }
}

module.exports = new AuthService();