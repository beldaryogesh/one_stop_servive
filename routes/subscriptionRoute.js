const express = require("express");
const Router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");
const commonMid = require("../middlwares/midd");

Router.get(
  "/oss/api/v1/subscription/getSubscription",
  [commonMid.verifyToken, commonMid.authorize],
  subscriptionController.getSubscription
);
Router.post(
  "/oss/api/v1/subscription/updateSubscription/:subscriptionId",
  [commonMid.verifyToken, commonMid.authorize],
  subscriptionController.updateSubscription
);
Router.delete(
  "/oss/api/v1/subscription/deleteSubscription/:subscriptionId",
  [commonMid.verifyToken, commonMid.authorize],
  subscriptionController.deleteSubscription
);

Router.post(
  "/oss/api/v1/subscription/buyNow/:subscriptionId",
  [commonMid.verifyToken, commonMid.authorize, commonMid.expiryCheck],
  subscriptionController.buyNow
);

module.exports = Router;
