const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  editOrderDetails,
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware"); // ⬅️

// ==================== USER ROUTES ====================

// Place a new order (user only)
router.post("/", authMiddleware, createOrder);

// Get orders of logged-in user
router.get("/my", authMiddleware, getMyOrders);

// Edit own order details (optional, depends on your logic)
router.put("/:id/edit", authMiddleware, editOrderDetails);

// ==================== ADMIN ROUTES ====================

// Get all orders (admin only)
router.get("/all", authMiddleware, adminMiddleware, getAllOrders);

// Update order status (admin only)
router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
