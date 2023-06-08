const express = require("express");
const Router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");
const commonMid = require("../middlwares/midd");


// [commonMid.verifyToken, commonMid.authorize],

Router.post(
  "/oss/api/v1/subscription/createSubscription",
  [commonMid.verifyToken, commonMid.authorize, commonMid.admin],
  subscriptionController.createSubscription
);
Router.get(
  "/oss/api/v1/subscription/getSubscription",
  [commonMid.verifyToken, commonMid.authorize, commonMid.seller_admin],
  subscriptionController.getSubscription
);
Router.put(
  "/oss/api/v1/subscription/updateSubscription/:subscriptionId",
  [commonMid.verifyToken, commonMid.authorize, commonMid.admin],
  subscriptionController.updateSubscription
);
Router.delete(
  "/oss/api/v1/subscription/deleteSubscription/:subscriptionId",
  [commonMid.verifyToken, commonMid.authorize, commonMid.admin],
  subscriptionController.deleteSubscription
);

Router.post(
  "/oss/api/v1/subscription/buyNow/:subscriptionId",
  [commonMid.verifyToken, commonMid.authorize, commonMid.expiryCheck],
  subscriptionController.buyNow
);

module.exports = Router;
