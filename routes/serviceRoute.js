const express = require("express");
const Router = express.Router();
const serviceController = require("../controllers/serviceController");
const commonMid = require("../middlwares/midd");

Router.post(
  "/oss/api/v1/service/addServices",
  [commonMid.verifyToken, commonMid.authorize, commonMid.seller_admin],
  serviceController.addService
);
Router.get(
  "/oss/api/v1/service/getService",
  [commonMid.verifyToken, commonMid.authorize],
  serviceController.getService
);
Router.get(
  "/oss/api/v1/service/getSellerData",
  [commonMid.verifyToken, commonMid.authorize],
  serviceController.getSellerData
);
Router.put(
  "/oss/api/v1/service/updateService/:serviceId",
  [commonMid.verifyToken, commonMid.authorize, commonMid.seller_admin],
  serviceController.updateService
);
Router.delete(
  "/oss/api/v1/service/deleteService/:serviceId",
  [commonMid.verifyToken, commonMid.authorize, commonMid.seller_admin],
  serviceController.deleteService
);

module.exports = Router;
