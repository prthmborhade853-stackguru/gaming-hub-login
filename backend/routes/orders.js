
const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/order");

const router = express.Router();

// Demo product catalog.
// Keep these prices consistent with the frontend.
const products = [
  { id: 1, name: "Wireless Gaming Controller", price: 2499, icon: "🎮" },
  { id: 2, name: "RGB Mechanical Keyboard", price: 1999, icon: "⌨️" },
  { id: 3, name: "Pro Gaming Headset", price: 1799, icon: "🎧" },
  { id: 4, name: "Precision Gaming Mouse", price: 999, icon: "🖱️" },
  { id: 5, name: "RGB Gaming Mousepad", price: 699, icon: "🟪" },
  { id: 6, name: "Pro Wireless Controller", price: 3299, icon: "🕹️" },
];

// POST /api/orders
router.post("/", async (req, res) => {
  try {
    const { customer, products: requestedItems } = req.body;

    if (!customer || !Array.isArray(requestedItems)) {
      return res.status(400).json({
        message: "Customer and products are required",
      });
    }

    const fields = [
      "fullName", "email", "phone",
      "address", "city", "state", "pincode",
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

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) ||
      !/^[6-9]\d{9}$/.test(customer.phone) ||
      !/^\d{6}$/.test(customer.pincode)
    ) {
      return res.status(400).json({
        message: "Invalid email, phone number or PIN code",
      });
    }

    if (requestedItems.length === 0 || requestedItems.length > 100) {
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

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      orderId: new mongoose.Types.ObjectId().toString(),
      customer: {
        fullName: customer.fullName.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        city: customer.city.trim(),
        state: customer.state.trim(),
        pincode: customer.pincode.trim(),
      },
      products: orderItems,
      totalAmount,
      paymentMethod: "Cash on Delivery",
      status: "Placed",
    });

    return res.status(201).json({
      message: "Order placed successfully",
      orderId: order.orderId,
      totalAmount: order.totalAmount,
      status: order.status,
    });
  } catch (error) {
    console.error("Order creation failed:", error);

    return res.status(500).json({
      message: "Unable to place order",
    });
  }
});

module.exports = router;

