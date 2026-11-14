
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const Otp = require("../models/Otp");
const { sendOtpEmail } = require("../utils/emailService");

const router = express.Router();

const OTP_EXPIRY = 5 * 60 * 1000;
const RESEND_COOLDOWN = 60 * 1000;
const VERIFICATION_EXPIRY = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function createToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function validEmail(email) {
  return (
    typeof email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  );
}

// Hash OTPs and verification tokens using a server-side secret.
function hashValue(value) {
  return crypto
    .createHmac("sha256", process.env.OTP_SECRET)
    .update(value)
    .digest("hex");
}

function safeCompare(a, b) {
  const first = Buffer.from(a, "hex");
  const second = Buffer.from(b, "hex");

  return (
    first.length === second.length &&
    crypto.timingSafeEqual(first, second)
  );
}

function createVerificationToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Send OTP and save its hash in MongoDB.
async function createAndSendOtp(email, purpose) {
  const existingOtp = await Otp.findOne({ email, purpose });

  if (
    existingOtp &&
    Date.now() - new Date(existingOtp.lastSentAt).getTime() <
      RESEND_COOLDOWN
  ) {
    const remaining = Math.ceil(
      (RESEND_COOLDOWN -
        (Date.now() - new Date(existingOtp.lastSentAt).getTime())) /
        1000
    );

    return {
      cooldown: true,
      remaining,
    };
  }

  const otp = crypto.randomInt(100000, 1000000).toString();

  const otpHash = hashValue(otp);

  const record = await Otp.findOneAndUpdate(
    { email, purpose },
    {
      $set: {
        otpHash,
        expiresAt: new Date(Date.now() + OTP_EXPIRY),
        attempts: 0,
        lastSentAt: new Date(),
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  try {
    await sendOtpEmail(email, otp, purpose);
  } catch (error) {
    // Remove the failed OTP only if it is still the same record.
    await Otp.deleteOne({
      _id: record._id,
      otpHash,
    });

    throw error;
  }

  return { cooldown: false };
}

// Verify OTP and replace it with a one-time verification token.
async function verifyOtpAndCreateToken(email, purpose, otp) {
  const record = await Otp.findOne({ email, purpose });

  if (!record) {
    return { error: "Invalid or expired OTP." };
  }

  if (record.expiresAt.getTime() <= Date.now()) {
    await Otp.deleteOne({ _id: record._id });
    return { error: "OTP has expired. Please request a new one." };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    await Otp.deleteOne({ _id: record._id });
    return { error: "Too many incorrect attempts. Request a new OTP." };
  }

  const submittedHash = hashValue(otp);

  if (!safeCompare(submittedHash, record.otpHash)) {
    record.attempts += 1;

    if (record.attempts >= MAX_ATTEMPTS) {
      await Otp.deleteOne({ _id: record._id });

      return {
        error: "Too many incorrect attempts. Request a new OTP.",
      };
    }

    await record.save();

    return {
      error: `Incorrect OTP. ${MAX_ATTEMPTS - record.attempts} attempts remaining.`,
    };
  }

  // Generate a random, one-time verification token.
  const verificationToken = createVerificationToken();

  record.otpHash = hashValue(verificationToken);
  record.expiresAt = new Date(Date.now() + VERIFICATION_EXPIRY);
  record.attempts = 0;

  await record.save();

  return { verificationToken };
}

// --------------------------------------------------
// 1. SEND REGISTRATION OTP
// POST /api/auth/send-registration-otp
// --------------------------------------------------

router.post("/send-registration-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!validEmail(email)) {
      return res.status(400).json({
        message: "Enter a valid email address.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const result = await createAndSendOtp(
      normalizedEmail,
      "register"
    );

    if (result.cooldown) {
      return res.status(429).json({
        message: `Please wait ${result.remaining} seconds before requesting another OTP.`,
      });
    }

    return res.json({
      message: "Registration OTP sent successfully.",
    });
  } catch (error) {
    console.error("Registration OTP error:", error);

    return res.status(500).json({
      message: "Unable to send registration OTP.",
    });
  }
});

// --------------------------------------------------
// 2. VERIFY REGISTRATION OTP
// POST /api/auth/verify-registration-otp
// --------------------------------------------------

router.post("/verify-registration-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!validEmail(email) || !/^\d{6}$/.test(String(otp || ""))) {
      return res.status(400).json({
        message: "Enter a valid email and 6-digit OTP.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const result = await verifyOtpAndCreateToken(
      normalizedEmail,
      "register",
      String(otp)
    );

    if (result.error) {
      return res.status(400).json({
        message: result.error,
      });
    }

    return res.json({
      message: "Email verified successfully.",
      verificationToken: result.verificationToken,
    });
  } catch (error) {
    console.error("Registration verification error:", error);

    return res.status(500).json({
      message: "Unable to verify email.",
    });
  }
});

// --------------------------------------------------
// 3. COMPLETE REGISTRATION
// POST /api/auth/register
// --------------------------------------------------

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, verificationToken } = req.body;

    if (
      typeof name !== "string" ||
      !validEmail(email) ||
      typeof password !== "string" ||
      name.trim().length < 2 ||
      password.length < 8 ||
      password.length > 72 ||
      typeof verificationToken !== "string" ||
      verificationToken.length !== 64
    ) {
      return res.status(400).json({
        message: "Enter valid registration details and verify your email.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const record = await Otp.findOne({
      email: normalizedEmail,
      purpose: "register",
    });

    if (
      !record ||
      record.expiresAt.getTime() <= Date.now() ||
      !safeCompare(
        hashValue(verificationToken),
        record.otpHash
      )
    ) {
      return res.status(401).json({
        message: "Email verification is invalid or expired. Verify again.",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Verification token is single-use.
    await Otp.deleteOne({ _id: record._id });

    const token = createToken(user);

    return res.status(201).json({
      message: "Registration successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Server error during registration.",
    });
  }
});

// --------------------------------------------------
// 4. SEND PASSWORD RESET OTP
// POST /api/auth/send-reset-otp
// --------------------------------------------------

router.post("/send-reset-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!validEmail(email)) {
      return res.status(400).json({
        message: "Enter a valid email address.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Do not reveal whether an account exists.
    if (!user) {
      return res.json({
        message: "If an account exists, a password reset OTP will be sent.",
      });
    }

    const result = await createAndSendOtp(
      normalizedEmail,
      "reset-password"
    );

    if (result.cooldown) {
      return res.status(429).json({
        message: `Please wait ${result.remaining} seconds before requesting another OTP.`,
      });
    }

    return res.json({
      message: "If an account exists, a password reset OTP will be sent.",
    });
  } catch (error) {
    console.error("Password reset OTP error:", error);

    return res.status(500).json({
      message: "Unable to process password reset request.",
    });
  }
});

// --------------------------------------------------
// 5. VERIFY PASSWORD RESET OTP
// POST /api/auth/verify-reset-otp
// --------------------------------------------------

router.post("/verify-reset-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!validEmail(email) || !/^\d{6}$/.test(String(otp || ""))) {
      return res.status(400).json({
        message: "Enter a valid email and 6-digit OTP.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const result = await verifyOtpAndCreateToken(
      normalizedEmail,
      "reset-password",
      String(otp)
    );

    if (result.error) {
      return res.status(400).json({
        message: result.error,
      });
    }

    return res.json({
      message: "OTP verified successfully.",
      resetToken: result.verificationToken,
    });
  } catch (error) {
    console.error("Reset OTP verification error:", error);

    return res.status(500).json({
      message: "Unable to verify OTP.",
    });
  }
});

// --------------------------------------------------
// 6. RESET PASSWORD
// POST /api/auth/reset-password
// --------------------------------------------------

router.post("/reset-password", async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    if (
      !validEmail(email) ||
      typeof resetToken !== "string" ||
      resetToken.length !== 64 ||
      typeof newPassword !== "string" ||
      newPassword.length < 8 ||
      newPassword.length > 72
    ) {
      return res.status(400).json({
        message: "Enter a valid email and password (8–72 characters).",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const record = await Otp.findOne({
      email: normalizedEmail,
      purpose: "reset-password",
    });

    if (
      !record ||
      record.expiresAt.getTime() <= Date.now() ||
      !safeCompare(
        hashValue(resetToken),
        record.otpHash
      )
    ) {
      return res.status(401).json({
        message: "Password reset session is invalid or expired.",
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "Account not found.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    // Reset token is single-use.
    await Otp.deleteOne({ _id: record._id });

    return res.json({
      message: "Password reset successfully. Please log in again.",
    });
  } catch (error) {
    console.error("Password reset error:", error);

    return res.status(500).json({
      message: "Unable to reset password.",
    });
  }
});

// --------------------------------------------------
// 7. CUSTOMER LOGIN
// POST /api/auth/login
// --------------------------------------------------

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      !validEmail(email) ||
      typeof password !== "string" ||
      !password ||
      password.length > 72
    ) {
      return res.status(400).json({
        message: "Enter your email and password.",
      });
    }

    const user = await User.findOne({
      email: normalizeEmail(email),
    }).select("+password");

    if (
      !user ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = createToken(user);

    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error during login.",
    });
  }
});

module.exports = router;
