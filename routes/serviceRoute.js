const express = require('express');
const Router = express.Router();
const serviceController = require("../controllers/serviceController");
const commonMid = require("../middlwares/midd")
Router.post('/addServices/:userId' , serviceController.addService)
Router.get("/getService" , serviceController.getService)
Router.get('/getSellerData/admin', serviceController.getSellerData)
Router.put("/serviceUpdate/:serviceId",  serviceController.updateService)
Router.get("/getAllService" , serviceController.getAllService)
Router.delete("/deleteService/:serviceId", serviceController.deleteService)
module.exports = Router;
