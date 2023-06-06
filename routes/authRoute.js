const express = require("express");
const router = express.Router();
const commonMid = require("../middlwares/midd");

const authController = require("../controllers/authController");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/verifyotp/:number", authController.verifyOtp);

module.exports = router;
