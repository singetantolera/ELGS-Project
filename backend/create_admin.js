// create_admin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas");

    const email = "kenasingetan44@gmail.com";
    const password = "kena4444[]{}";
    const fullName = "Singetan Tolera"; // ✅ FIXED

    let existing = await User.findOne({ email });

    if (existing) {
      existing.role = "admin";
      existing.password = password; // will be hashed by pre-save
      existing.fullName = fullName; // ensure fullName exists
      await existing.save();
      console.log("✅ Existing user upgraded to admin:", email);
    } else {
      const admin = new User({
        fullName, // ✅ FIXED
        email,
        password,
        role: "admin",
      });

      await admin.save();
      console.log("✅ New admin created successfully:", email);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  }
}

createAdmin();