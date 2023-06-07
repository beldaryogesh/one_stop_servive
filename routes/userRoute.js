const express = require("express");
const Router = express.Router();
const commonMid = require("../middlwares/midd");

const userController = require("../controllers/userController");

Router.get(
  "/oss/api/v1/user/userData",
  [commonMid.verifyToken, commonMid.authorize],
  userController.getData
);
Router.put(
  "/oss/api/v1/user/update/:userId",
  [commonMid.isAdmin, commonMid.verifyToken, commonMid.authorize],
  userController.updateUser
);
Router.delete(
  "/oss/api/v1/user/delete/:userId",
  [commonMid.verifyToken, commonMid.authorize],
  userController.deleteUser
);

module.exports = Router;
