const userModel = require("../models/userModel");
const subscriptionModel = require("../models/subscriptionModel");

const {
  isValidRequestBody,
  isvalid,
  nameRegex,
} = require("../validations/validation");

const getSubscription = async function (req, res) {
  try {
    const subscription = await subscriptionModel.find({});
    if (subscription.length == 0) {
      return res.status(404).send({
        status: false,
        message: "no subscription plan available for now",
      });
    }
    return res.status(200).send({ status: true, data: subscription });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const updateSubscription = async function (req, res) {
  try {
    let data = req.body;
    let userId = req.userId;
    let subscriptionId = req.params.subscriptionId;
    let user = await userModel.findById(userId);
    if (user.userType != "admin") {
      return res
        .status(400)
        .send({ status: false, message: "only admin can access this api" });
    }
    if (!isValidRequestBody(data)) {
      return res.status(400).send({
        status: false,
        message: "please provide data for upadte subscription",
      });
    }
    let { subscriptionName, description, subscriptionPrice } = data;
    let obj = {};
    let subscription = await subscriptionModel.findById(subscriptionId);
    if (subscriptionName != undefined) {
      if (!isvalid(subscriptionName)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide subscription name" });
      }
      if (!nameRegex.test(subscriptionName)) {
        return res.status(400).send({
          status: false,
          message: "please provide valid subscription name",
        });
      }
      if (subscription.subscriptionName == subscriptionName) {
        return res.status(400).send({
          status: false,
          message: "please provide unique subscription name",
        });
      }
      obj["subscriptionName"] = subscriptionName;
    }
    if (description != undefined) {
      if (!isvalid(description)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide description" });
      }
      if (subscription.description == description) {
        return res.status(400).send({
          status: false,
          message: "please provide unique description",
        });
      }
      obj["description"] = description;
    }
    if (subscriptionPrice != undefined) {
      if (!isvalid(subscriptionPrice)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide subscription name" });
      }
      if (!Number(subscriptionPrice)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide valid price" });
      }
      if (subscription.subscriptionPrice == subscriptionPrice) {
        return res
          .status(400)
          .send({ status: false, message: "please provide unique price" });
      }
      obj["subscriptionName"] = subscriptionName;
    }
    let update_Subscription = await subscriptionModel.findByIdAndUpdate(
      { _id: subscriptionId },
      { $set: obj },
      { new: true }
    );
    res
      .status(201)
      .send({ status: true, message: "success", data: update_Subscription });
    user.save();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const deleteSubscription = async function (req, res) {
  try {
    let subscriptionId = req.params.subscriptionId;
    let userId = req.userId;
    const user = await userModel.findById(userId);
    if (user.userType != "admin") {
      return res
        .status(400)
        .send({ status: false, message: "only admin can access this api" });
    }
    const subscription = await subscriptionModel.findById(subscriptionId);
    if (subscription.isDeleted == true) {
      return res.status(400).send({
        status: false,
        message: "subscriptin plan is already deleted",
      });
    }
    await subscriptionModel.findOneAndUpdate(
      { _id: subscriptionId },
      { isDeleted: true, deletedAt: Date.now() }
    );
    return res
      .status(200)
      .send({ status: false, message: "subscription plan is deleted" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const buyNow = async function (req, res) {
  try {
    let subscriptionId = req.params.subscriptionId;
    let userId = req.userId;
    const user = await userModel.findById(userId);
    const subscription = await subscriptionModel.findById(subscriptionId);
    if (user.subscriptionId) {
      return res
        .status(400)
        .send({ status: false, message: "subscription is already present" });
    } else {
      user["subscriptionId"] = subscriptionId;
      subscription.userSubscription.push(user._id);
      let expiryDate = new Date();
      let flag = expiryDate.getMonth() + subscription.subscriptionMonth;
      if (flag > 11) {
        let year = expiryDate.getFullYear() + 1;
        let month = flag - 11 - 1;
        expiryDate.setFullYear(year);
        expiryDate.setMonth(month);
      } else {
        let month = flag - 0;
        expiryDate.setMonth(month);
      }
      user["expiryDate"] = expiryDate;
      user.save();
      subscription.save();
    }
    return res
      .status(200)
      .send({ status: true, message: "subscription done successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  getSubscription,
  updateSubscription,
  deleteSubscription,
  buyNow,
};
