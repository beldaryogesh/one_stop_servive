const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { isValid } = require("../validations/validation");
const userModel = require("../models/userModel");
const serviceModel = require("../models/serviceModel");

const admin = async function(req, res, next){
  try {
    let userId = req.userId
    const check_user = await userModel.findById(userId)
    if(check_user.userType != 'admin'){
      return res.status(403).send({status : false, message : 'only admin can access this api'})
    }
    next()
  } catch (error) {
    return res.status(500).send({status : false, message : error.message})
  }
}

const seller_admin = async function(req, res, next){
  try {
    let userId = req.userId;
    let user = await userModel.findById(userId)

    if(user.userType == 'customer'){
      return res.status(400).send({status : false, message : 'only seller and admin can access this api'})
    }
    next()
    
  } catch (error) {
    return res.status(500).send({status : false, message : error.message})
  }
}

const seller = async function (req, res, next){
  try {
    let userId = req.userId;
    let user = await userModel.findById(userId)
    console.log(userId);
    if(user.userType != 'seller'){
      return res.status(400).send({status : false, message : 'only seller can access this api'})
    }
    next()
  } catch (error) {
    return res.status(500).send({status : false, Message : error.message})
  }
}

const isAdmin = async function (req, res, next) {
  try {
    let userType = req.body.userType;

    if (req.body.userStatus) {
      if (userType == "admin") {
        return next();
      } else {
        return res
          .status(400)
          .send({ status: false, message: "only admin can access this api" });
      }
    }
    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const verifyToken = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      return res.status(403).send({ message: "no token provided" });
    }
    jwt.verify(token, "one-stop-service", (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized" });
      } else {
        req["userId"] = decoded.userId;
        next();
      }
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const authorize = async function (req, res, next) {
  try {
    let userId = req.userId;
    let user = await userModel.findById(userId)
    if (!user) {
      return res.status(404).send({ message: "you are not registerd" });
    }
    if (userId != user._id) {
      return res.status(403).send({ message: "provide your own token" });
    }
    next();
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const numberVerification = async function (req, res, next) {
  try {
    let number = req.params.number;
    let userId = req.userId;
    let user = await userModel.findById(userId);
    if (user.number != number) {
      return res
        .status(403)
        .send({ status: false, message: "provide your own token" });
    }
    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const expiryCheck = async function (req, res, next) {
  try {
    let userId = req.userId;
    const user = await userModel.findById(userId);
    if (user.userType == "seller") {
      const expirationDate = user.expiryDate;
      if (Date.now() > expirationDate) {
        return res.status(400).send({
          message: "Subscription Expired",
        });
      }
    }
    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  admin,
  seller_admin,
  isAdmin,
  verifyToken,
  seller,
  authorize,
  numberVerification,
  expiryCheck,
};
