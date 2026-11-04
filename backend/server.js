
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const orderRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000"
}));

app.use(express.json());

app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Gaming Hub API is running!");
});

app.get("/api/health", (req, res) => {
  res.json({ message: "Gaming Hub API is running" });
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
      throw new Error("Set MONGODB_URI and JWT_SECRET in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    const port = process.env.PORT || 5001;

    app.listen(port, () => {
      console.log(`Backend running at http://localhost:${port}`);
    });

  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
