
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    purpose: {
      type: String,
      required: true,
      enum: ["register", "reset-password"],
    },

    // Store only the hashed OTP, never the original OTP.
    otpHash: {
      type: String,
      required: true,
    },

    // OTP expires after 5 minutes.
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },

    // Maximum 5 incorrect attempts.
    attempts: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // Used to enforce resend cooldown.
    lastSentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Only one active OTP record per email and purpose.
otpSchema.index(
  { email: 1, purpose: 1 },
  { unique: true }
);

module.exports = mongoose.model("Otp", otpSchema);
