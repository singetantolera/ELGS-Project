// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
// const { validationResult } = require('express-validator');
// const AppError = require('../utils/AppError');
// const catchAsync = require('../utils/catchAsync');
// const emailService = require('../services/emailService');

// // Generate JWT Token
// const signToken = (id, role) => {
//   return jwt.sign({ id, role }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE
//   });
// };

// // Create and send token response
// const createSendToken = (user, statusCode, res) => {
//   const token = signToken(user._id, user.role);
  
//   // Remove password from output
//   user.password = undefined;
  
//   res.status(statusCode).json({
//     status: 'success',
//     token,
//     user
//   });
// };

// // @desc    Register user
// // @route   POST /api/auth/register
// // @access  Public
// exports.register = catchAsync(async (req, res, next) => {
//   // Validation
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return next(new AppError('Validation failed', 400, errors.array()));
//   }

//   const { fullName, email, password, phone, profession } = req.body;

//   // Check if user exists
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     return next(new AppError('User already exists with this email', 400));
//   }

//   // Create user
//   const user = await User.create({
//     fullName,
//     email,
//     password,
//     phone,
//     profession
//   });

//   // Generate email verification token
//   const verificationToken = crypto.randomBytes(32).toString('hex');
//   user.emailVerificationToken = crypto
//     .createHash('sha256')
//     .update(verificationToken)
//     .digest('hex');
//   user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
//   await user.save({ validateBeforeSave: false });

//   // Send verification email
//   try {
//     await emailService.sendVerificationEmail(user.email, verificationToken);
//   } catch (err) {
//     console.error('Email sending failed:', err);
//   }

//   createSendToken(user, 201, res);
// });

// // @desc    Login user
// // @route   POST /api/auth/login
// // @access  Public
// exports.login = catchAsync(async (req, res, next) => {
//   const { email, password } = req.body;

//   // Check if email and password exist
//   if (!email || !password) {
//     return next(new AppError('Please provide email and password', 400));
//   }

//   // Find user and include password field
//   const user = await User.findOne({ email }).select('+password');
  
//   if (!user || !(await user.comparePassword(password))) {
//     return next(new AppError('Invalid email or password', 401));
//   }

//   // Update last login
//   user.lastLogin = Date.now();
//   await user.save({ validateBeforeSave: false });

//   createSendToken(user, 200, res);
// });

// // @desc    Logout user
// // @route   POST /api/auth/logout
// // @access  Private
// exports.logout = catchAsync(async (req, res, next) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'Logged out successfully'
//   });
// });

// // @desc    Get current user
// // @route   GET /api/auth/me
// // @access  Private
// exports.getMe = catchAsync(async (req, res, next) => {
//   const user = await User.findById(req.user.id);
  
//   res.status(200).json({
//     status: 'success',
//     user
//   });
// });

// // @desc    Update profile
// // @route   PUT /api/auth/profile
// // @access  Private
// exports.updateProfile = catchAsync(async (req, res, next) => {
//   const { fullName, phone, profession, bio, preferences } = req.body;
  
//   const user = await User.findByIdAndUpdate(
//     req.user.id,
//     { fullName, phone, profession, bio, preferences },
//     { new: true, runValidators: true }
//   );

//   res.status(200).json({
//     status: 'success',
//     user
//   });
// });

// // @desc    Change password
// // @route   POST /api/auth/change-password
// // @access  Private
// exports.changePassword = catchAsync(async (req, res, next) => {
//   const { currentPassword, newPassword } = req.body;

//   // Get user with password
//   const user = await User.findById(req.user.id).select('+password');

//   // Check current password
//   if (!(await user.comparePassword(currentPassword))) {
//     return next(new AppError('Current password is incorrect', 401));
//   }

//   // Update password
//   user.password = newPassword;
//   await user.save();

//   res.status(200).json({
//     status: 'success',
//     message: 'Password changed successfully'
//   });
// });

// // @desc    Forgot password
// // @route   POST /api/auth/forgot-password
// // @access  Public
// exports.forgotPassword = catchAsync(async (req, res, next) => {
//   const { email } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) {
//     return next(new AppError('No user found with this email', 404));
//   }

//   // Generate reset token
//   const resetToken = crypto.randomBytes(32).toString('hex');
//   user.passwordResetToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');
//   user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
//   await user.save({ validateBeforeSave: false });

//   // Send email
//   try {
//     await emailService.sendPasswordResetEmail(user.email, resetToken);
    
//     res.status(200).json({
//       status: 'success',
//       message: 'Password reset email sent'
//     });
//   } catch (err) {
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save({ validateBeforeSave: false });
    
//     return next(new AppError('Error sending email. Try again later.', 500));
//   }
// });

// // @desc    Reset password
// // @route   POST /api/auth/reset-password/:token
// // @access  Public
// exports.resetPassword = catchAsync(async (req, res, next) => {
//   const { token } = req.params;
//   const { password } = req.body;

//   // Hash token
//   const hashedToken = crypto
//     .createHash('sha256')
//     .update(token)
//     .digest('hex');

//   // Find user with valid token
//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() }
//   });

//   if (!user) {
//     return next(new AppError('Token is invalid or has expired', 400));
//   }

//   // Update password
//   user.password = password;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save();

//   createSendToken(user, 200, res);
// });

// // @desc    Verify email
// // @route   POST /api/auth/verify-email/:token
// // @access  Public
// exports.verifyEmail = catchAsync(async (req, res, next) => {
//   const { token } = req.params;

//   const hashedToken = crypto
//     .createHash('sha256')
//     .update(token)
//     .digest('hex');

//   const user = await User.findOne({
//     emailVerificationToken: hashedToken,
//     emailVerificationExpires: { $gt: Date.now() }
//   });

//   if (!user) {
//     return next(new AppError('Token is invalid or has expired', 400));
//   }

//   user.isEmailVerified = true;
//   user.emailVerificationToken = undefined;
//   user.emailVerificationExpires = undefined;
//   await user.save();

//   res.status(200).json({
//     status: 'success',
//     message: 'Email verified successfully'
//   });
// });




//The updated code files
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const emailService = require('../services/emailService');


// Generate JWT Token
const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};


// Send token response
const createSendToken = (user, statusCode, res) => {

  const token = signToken(user._id, user.role);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    user
  });

};



// ================= REGISTER =================
exports.register = catchAsync(async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400, errors.array()));
  }

  const { fullName, email, password, phone, profession } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new AppError('User already exists with this email', 400));
  }

  // Create user
  const user = await User.create({
    fullName,
    email,
    password,
    phone,
    profession,
    isEmailVerified: false
  });

  // Create verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  user.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  try {
    // DEBUGGING - Add these lines  KAN ITTI DABALE
  console.log('=== DEBUG INFO ===');
  console.log('User object:', user);
  console.log('User.fullName:', user.fullName);
  console.log('User.email:', user.email);
  console.log('Verification token:', verificationToken);
  console.log('=================');

   await emailService.sendVerificationEmail(
  user.email,
  user.fullName,  // ✅ Correct - name as second parameter
  verificationToken
);

    res.status(201).json({
      status: 'success',
      message: 'Registration successful. Please verify your email.'
    });

  } catch (err) {

    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new AppError('Error sending verification email.', 500));
  }

});



// ================= LOGIN =================
exports.login = catchAsync(async (req, res, next) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  if (!user.isEmailVerified) {
    return next(new AppError('Please verify your email before login.', 401));
  }

  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, res);

});



// ================= LOGOUT =================
exports.logout = catchAsync(async (req, res, next) => {

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });

});



// ================= GET CURRENT USER =================
exports.getMe = catchAsync(async (req, res, next) => {

  const user = await User.findById(req.user.id);

  res.status(200).json({
    status: 'success',
    user
  });

});



// ================= UPDATE PROFILE =================
exports.updateProfile = catchAsync(async (req, res, next) => {

  const { fullName, phone, profession, bio, preferences } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { fullName, phone, profession, bio, preferences },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    user
  });

});



// ================= CHANGE PASSWORD =================
exports.changePassword = catchAsync(async (req, res, next) => {

  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Current password is incorrect', 401));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password changed successfully'
  });

});



// ================= FORGOT PASSWORD =================
exports.forgotPassword = catchAsync(async (req, res, next) => {

  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('No user found with this email', 404));
  }

  const resetToken = crypto.randomBytes(32).toString('hex');

  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  try {

  await emailService.sendPasswordResetEmail(
  user.email,
  user.fullName,  // ✅ Correct - name as second parameter
  resetToken
);

    res.status(200).json({
      status: 'success',
      message: 'Password reset email sent'
    });

  } catch (err) {

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new AppError('Error sending email.', 500));

  }

});



// ================= RESET PASSWORD =================
exports.resetPassword = catchAsync(async (req, res, next) => {

  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }

  user.password = password;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createSendToken(user, 200, res);

});



// ================= VERIFY EMAIL =================
exports.verifyEmail = catchAsync(async (req, res, next) => {

  const { token } = req.params;

  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }

  user.isEmailVerified = true;

  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully'
  });

});



// // ================= UPLOAD AVATAR =================
// exports.uploadAvatar = catchAsync(async (req, res, next) => {

//   if (!req.file) {
//     return next(new AppError('Please upload an image', 400));
//   }

//   const avatarPath = `/uploads/avatars/${req.file.filename}`;

//   const user = await User.findByIdAndUpdate(
//     req.user.id,
//     { avatar: avatarPath },
//     { new: true, runValidators: true }
//   );

//   res.status(200).json({
//     status: 'success',
//     message: 'Avatar uploaded successfully',
//     avatar: avatarPath,
//     user
//   });

// });
// ================= UPLOAD AVATAR =================
exports.uploadAvatar = catchAsync(async (req, res, next) => {

  if (!req.file) {
    return next(new AppError('Please upload an image', 400));
  }

  // Get the base URL from request
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const avatarPath = `/uploads/avatars/${req.file.filename}`;
  const fullAvatarUrl = `${baseUrl}${avatarPath}`;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatar: avatarPath }, // Store relative path in DB
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Avatar uploaded successfully',
    avatar: fullAvatarUrl, // Send full URL to frontend
    user
  });

});