
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Order = require("../models/order");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// Demo product catalog
const products = [
  { id: 1, name: "Wireless Gaming Controller", price: 2499, icon: "🎮" },
  { id: 2, name: "RGB Mechanical Keyboard", price: 1999, icon: "⌨️" },
  { id: 3, name: "Pro Gaming Headset", price: 1799, icon: "🎧" },
  { id: 4, name: "Precision Gaming Mouse", price: 999, icon: "🖱️" },
  { id: 5, name: "RGB Gaming Mousepad", price: 699, icon: "🟪" },
  { id: 6, name: "Pro Wireless Controller", price: 3299, icon: "🕹️" },
];

// Customer authentication middleware
async function customerAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Please login to continue",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.sub || !decoded.email) {
      return res.status(401).json({
        message: "Invalid customer token",
      });
    }

    req.customer = {
      id: decoded.sub,
      email: decoded.email.toLowerCase(),
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired login session",
    });
  }
}

// POST /api/orders
// Place order for logged-in customer
router.post("/", customerAuth, async (req, res) => {
  try {
    const { customer, products: requestedItems } = req.body;

    if (!customer || !Array.isArray(requestedItems)) {
      return res.status(400).json({
        message: "Customer and products are required",
      });
    }

    const fields = [
      "fullName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];

    const invalidCustomer = fields.some(
      (field) =>
        typeof customer[field] !== "string" ||
        !customer[field].trim() ||
        customer[field].length > 500
    );

    if (invalidCustomer) {
      return res.status(400).json({
        message: "Please provide valid delivery details",
      });
    }

    const email = customer.email.trim().toLowerCase();

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !/^[6-9]\d{9}$/.test(customer.phone.trim()) ||
      !/^\d{6}$/.test(customer.pincode.trim())
    ) {
      return res.status(400).json({
        message: "Invalid email, phone number or PIN code",
      });
    }

    // Prevent placing an order using another person's email
    if (email !== req.customer.email) {
      return res.status(403).json({
        message: "Delivery email must match your logged-in account",
      });
    }

    if (
      requestedItems.length === 0 ||
      requestedItems.length > 100
    ) {
      return res.status(400).json({
        message: "Invalid cart",
      });
    }

    const orderItems = [];

    for (const item of requestedItems) {
      const product = products.find(
        (p) => p.id === item.productId
      );

      if (
        !product ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 100
      ) {
        return res.status(400).json({
          message: "Invalid product or quantity",
        });
      }

      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        icon: product.icon,
      });
    }

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const shippingAmount = subtotal < 3000 ? 99 : 0;
    const totalAmount = subtotal + shippingAmount;

    const order = await Order.create({
      orderId: new mongoose.Types.ObjectId().toString(),
      userId: req.customer.id,
      customer: {
        fullName: customer.fullName.trim(),
        email,
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        city: customer.city.trim(),
        state: customer.state.trim(),
        pincode: customer.pincode.trim(),
      },
      products: orderItems,
      shippingAmount,
      totalAmount,
      paymentMethod: "Cash on Delivery",
      status: "Placed",
    });

    return res.status(201).json({
      message: "Order placed successfully",
      orderId: order.orderId,
      subtotal,
      shippingAmount,
      totalAmount,
      status: order.status,
    });
  } catch (error) {
    console.error("Order creation failed:", error);

    return res.status(500).json({
      message: "Unable to place order",
    });
  }
});

// GET /api/orders/my-orders
// Customer views their own orders
router.get("/my-orders", customerAuth, async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.customer.id,
    }).sort({ createdAt: -1 });

    return res.json({
      orders,
    });
  } catch (error) {
    console.error("Fetching customer orders failed:", error);

    return res.status(500).json({
      message: "Unable to fetch your orders",
    });
  }
});

// GET /api/orders/admin/all
// Admin views all orders
router.get("/admin/all", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });

    return res.json({
      orders,
    });
  } catch (error) {
    console.error("Fetching all orders failed:", error);

    return res.status(500).json({
      message: "Unable to fetch orders",
    });
  }
});

// PATCH /api/orders/admin/:id/status
// Admin updates order status
router.patch(
  "/admin/:id/status",
  adminAuth,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const allowedStatuses = [
        "Placed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          message: "Invalid order ID",
        });
      }

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid order status",
        });
      }

      const order = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      return res.json({
        message: "Order status updated successfully",
        order,
      });
    } catch (error) {
      console.error("Order status update failed:", error);

      return res.status(500).json({
        message: "Unable to update order status",
      });
    }
  }
);

module.exports = router;
