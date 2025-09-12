const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  updateProfile
} = require('../controllers/authController');
const authMiddleware = require("../middleware/authMiddleware");

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
