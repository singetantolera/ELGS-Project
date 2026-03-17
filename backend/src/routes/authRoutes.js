const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const axios = require('axios');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

// ✅ ADD THIS IMPORT (upload middleware)
const upload = require('../middleware/upload');

const router = express.Router();

// Validation constants
const registerValidation = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional(),
  body('profession').optional()
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Please provide a valid email')
];

const resetPasswordValidation = [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// ✅ PUBLIC ROUTES
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/forgot-password', forgotPasswordValidation, authController.forgotPassword);
router.post('/reset-password/:token', resetPasswordValidation, authController.resetPassword);
router.post('/verify-email/:token', authController.verifyEmail);

/* =====================================================
   GOOGLE OAUTH LOGIN
===================================================== */

// 🔹 Step 1: Redirect user to Google
router.get('/google', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.BACKEND_URL}/api/auth/google/callback`;
  const scope = 'email profile';

  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scope)}` +
    `&access_type=offline`;

  console.log("Redirecting to Google:", authUrl);

  res.redirect(authUrl);
});


/* =====================================================
   GOOGLE CALLBACK
===================================================== */

router.get('/google/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ message: "No code provided" });
  }

  try {
    // 🔹 Step 2: Exchange code for access token
    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.BACKEND_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }
    );

    const { access_token } = tokenResponse.data;

    // 🔹 Step 3: Get user info from Google
    const userResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { email, name, picture } = userResponse.data;

    // 🔹 Step 4: Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture,
        password: 'google-oauth-user',
      });
    }

    // 🔹 Step 5: Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 🔹 Step 6: Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);

  } catch (error) {
    console.error("Google OAuth Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Google authentication failed" });
  }
});


// ✅ PROTECTED ROUTES
router.use(protect);

router.post('/logout', authController.logout);
router.get('/me', authController.getMe);
router.put('/profile', authController.updateProfile);
router.post('/change-password', changePasswordValidation, authController.changePassword);
// ✅ NEW ROUTE FOR AVATAR UPLOAD
router.post('/upload-avatar',protect,upload.single('avatar'),authController.uploadAvatar);

module.exports = router;