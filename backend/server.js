
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const adminAuthRoutes = require("./routes/adminAuth");
const orderRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");

const app = express();

// ==========================================
// CORS CONFIGURATION
// ==========================================

const allowedOrigins = [
  "http://localhost:3000",
  "https://gaming-hub-login-ruby.vercel.app",
  "https://gaming-hub-git-main-prath-stackguru.vercel.app",
  "https://gaming-luu54d4mw-prath-stackguru.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without an Origin header
    if (!origin) {
      return callback(null, true);
    }

    let hostname;

    try {
      hostname = new URL(origin).hostname;
    } catch (error) {
      return callback(new Error("Invalid request origin"));
    }

    // Allow exact domains and Gaming Hub Vercel preview deployments
    const isAllowed =
      allowedOrigins.includes(origin) ||
      (
        hostname.startsWith("gaming-") &&
        hostname.endsWith("-prath-stackguru.vercel.app")
      );

    if (isAllowed) {
      return callback(null, true);
    }

    console.log("Blocked CORS origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  credentials: true,
};

// Apply CORS middleware before API routes
app.use(cors(corsOptions));

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

// ==========================================
// HEALTH CHECK ROUTES
// ==========================================

app.get("/", (req, res) => {
  res.send("Gaming Hub API is running!");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Gaming Hub API is running",
  });
});

// ==========================================
// START SERVER
// ==========================================

async function startServer() {
  try {
    // Check required environment variables
    if (
      !process.env.MONGODB_URI ||
      !process.env.JWT_SECRET ||
      !process.env.OTP_SECRET ||
      !process.env.RESEND_API_KEY ||
      !process.env.RESEND_FROM_EMAIL
    ) {
      throw new Error(
        "Missing required environment variables. Check backend/.env or Render Environment settings."
      );
    }

    // Connect MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    // Start Express server
    const port = process.env.PORT || 5001;

    app.listen(port, () => {
      console.log(`Gaming Hub backend running on port ${port}`);
    });

  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
