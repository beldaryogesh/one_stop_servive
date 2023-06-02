const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { isValid } = require("../validations/validation");
const userModel = require("../models/userModel");
const serviceModel = require("../models/serviceModel");

const isAdmin = function (req, res, next) {
  try {
    const userType = req.body.userType;
    if (userType === "admin") {
      next();
    } else {
      return res
        .status(400)
        .send({ status: false, message: "only admin can access this api" });
    }
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
        next()
      }
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


const authorize = async function (req, res, next){
  try {
    let userId = req.userId;
    let user = await userModel.findById(userId);
    if(!user){
      return res
      .status(404)
      .send({message : "userId not present"})
    }
    if(userId != user._id){
      return res
      .status(403)
      .send({message : "provide your own token"})
    }
    next()
  } catch (error) {
    return res.status(500).send({message : error.message})
  }
}

module.exports = { isAdmin, verifyToken, authorize };
