const express = require("express");
const router = express.Router();
const commonMid = require("../middlwares/midd");
const adminController = require("../controllers/adminController");

router.post("/createAdmin",[commonMid.verifyToken, commonMid.authorize], adminController.createAdmin);
router.post("/adminlogin",[commonMid.verifyToken, commonMid.authorize], adminController.adminLogin);

module.exports = router;
