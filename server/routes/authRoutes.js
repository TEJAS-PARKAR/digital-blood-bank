const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const { loginUser } = require("../controllers/authController");

// existing login route (keep it)
router.post("/login", loginUser);

// ✅ Google OAuth - Step 1 (redirect)
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ✅ Google OAuth - Step 2 (callback)
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { profile } = req.user;

    // Set cookie with profile data for profile completion
    res.cookie("googleProfile", JSON.stringify(profile), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 60 * 1000, // 10 minutes
    });

    // Redirect to register for profile completion
    res.redirect(`http://localhost:5173/register`);
  }
);

// Server-side route to resolve user from cookie token
router.get("/me", async (req, res) => {
  const token = req.cookies?.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-__v");

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, user });
    } catch (err) {
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  } else {
    // Check for googleProfile cookie for profile completion
    const googleProfile = req.cookies?.googleProfile;
    if (googleProfile) {
      try {
        const profile = JSON.parse(googleProfile);
        res.json({
          success: true,
          profile: {
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            isProfileComplete: false
          }
        });
      } catch (err) {
        res.status(400).json({ success: false, message: "Invalid profile data" });
      }
    } else {
      res.status(401).json({ success: false, message: "Not authenticated" });
    }
  }
});

// Logout route to clear cookie
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ success: true, message: "Logged out" });
});

module.exports = router;