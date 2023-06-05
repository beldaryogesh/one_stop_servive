const express = require('express');
const router = express.Router()
const commonMid = require("../middlwares/midd")
const adminController = require("../controllers/adminController");

router.post('/createAdmin', adminController.createAdmin )
router.post('/adminlogin', adminController.adminLogin)

module.exports = router
