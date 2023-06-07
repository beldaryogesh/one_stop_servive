const express = require("express");
const router = express.Router();
const commonMid = require("../middlwares/midd");

const authController = require("../controllers/authController");

router.post("/oss/api/v1/user/register", authController.registerUser);
router.post("/oss/api/v1/user/login", authController.loginUser);
router.post(
  "/oss/api/v1/user/verify/:number",
  [commonMid.verifyToken, commonMid.authorize, commonMid.numberVerification],
  authController.verifyOtp
);

module.exports = router;
