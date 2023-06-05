const express = require('express');
const Router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");
const timeSubscription = require("../controllers/timeSubscription")
const commonMid = require("../middlwares/midd");
// const sub_mid = require("../middlwares/UserandExpiryCheck")

Router.post('/createSubscription' ,[ commonMid.verifyToken, commonMid.authorize], subscriptionController.createSubscription)
Router.get('/getSubscription',[ commonMid.verifyToken, commonMid.authorize], subscriptionController.getSubscription)
Router.post('/updateSubscription/:subscriptionId',[ commonMid.verifyToken, commonMid.authorize],  subscriptionController.updateSubscription)
Router.delete('/deleteSubscription/:subscriptionId',[ commonMid.verifyToken, commonMid.authorize], subscriptionController.deleteSubscription)





module.exports = Router;









