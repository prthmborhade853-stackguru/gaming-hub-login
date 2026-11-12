
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

async function adminAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Admin authentication required."
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin" || !decoded.sub) {
      return res.status(403).json({
        message: "Admin access denied."
      });
    }

    const admin = await Admin.findById(decoded.sub);

    if (!admin) {
      return res.status(401).json({
        message: "Admin account no longer exists."
      });
    }

    req.admin = {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role
    };

    next();

  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        message: "Invalid or expired admin token."
      });
    }

    console.error("Admin authentication error:", error);

    return res.status(500).json({
      message: "Admin authentication failed."
    });
  }
}

module.exports = adminAuth;
