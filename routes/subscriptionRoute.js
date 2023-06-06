const express = require("express");
const Router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");
const commonMid = require("../middlwares/midd");

Router.post(
  "/createSubscription",
  [commonMid.verifyToken, commonMid.authorize],
  subscriptionController.createSubscription
);
Router.get(
  "/getSubscription",
  [commonMid.verifyToken, commonMid.authorize],
  subscriptionController.getSubscription
);
Router.post(
  "/updateSubscription/:subscriptionId",
  [commonMid.verifyToken, commonMid.authorize],
  subscriptionController.updateSubscription
);
Router.delete(
  "/deleteSubscription/:subscriptionId",
  [commonMid.verifyToken, commonMid.authorize],
  subscriptionController.deleteSubscription
);

Router.post(
  "/buyNow/:subscriptionId",
  [commonMid.verifyToken, commonMid.authorize, commonMid.expiryCheck],
  subscriptionController.buyNow
);

module.exports = Router;