
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const adminAuth = require("../middleware/adminAuth");
const router = express.Router();

// Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password ||
      password.length > 72
    ) {
      return res.status(400).json({
        message: "Enter a valid email and password."
      });
    }

    const admin = await Admin.findOne({
      email: email.trim().toLowerCase()
    }).select("+password");

    if (
      !admin ||
      !(await bcrypt.compare(password, admin.password))
    ) {
      return res.status(401).json({
        message: "Invalid admin email or password."
      });
    }

    const token = jwt.sign(
      {
        sub: admin._id.toString(),
        email: admin.email,
        role: "admin"
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      message: "Server error during admin login."
    });
  }
});
// Verify current admin session
router.get("/me", adminAuth, (req, res) => {
  res.json({
    message: "Admin session verified",
    admin: req.admin
  });
});

module.exports = router;
