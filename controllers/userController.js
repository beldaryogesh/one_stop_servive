const userModel = require("../models/userModel");
const pinValidator = require("pincode-validator");
const serviceModel = require("../models/serviceModel");
const bcrypt = require("bcrypt");

const {
  isvalid,
  nameRegex,
  phoneRegex,
  emailRegex,
  passRegex,
  isValidRequestBody,
} = require("../validations/validation");
const subscriptionModel = require("../models/subscriptionModel");

const getData = async function (req, res) {
  try {
    let filters = req.query.userType;
    let serviceName = req.query.serviceName;
    if (filters !== undefined) {
      let user = await userModel.find({ userType: filters });
      if (user.length == 0) {
        return res.status(404).send({
          status: false,
          message: "No such user found in the database for this userType",
        });
      }
      return res
        .status(200)
        .send({ status: true, message: "user list", data: user });
    } else if (serviceName !== undefined) {
      let seller = await serviceModel.find({ serviceName: serviceName });
      if (seller.length == 0) {
        return res.status(404).send({
          status: false,
          message: `No such user found in the database for this ${serviceName}`,
        });
      }
      return res.status(200).send({
        status: false,
        message: "seller list",
        data: seller,
      });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const updateUser = async function (req, res) {
  try {
    let userId = req.params.userId;
    let data = req.body;
    if (!isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide data for update" });
    }
    const { name, number, email, password, address, userType, userStatus } =
      data;

    let obj = {};
    if (name != undefined) {
      if (!isvalid(name)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide name" });
      }
      if (!nameRegex.test(name))
        return res.status(400).send({
          status: false,
          message: "name should contain alphabets only.",
        });
      const nameData = await userModel.findOne({ name: name });
      if (nameData)
        return res
          .status(400)
          .send({ status: false, msg: `${name} is already present` });
    }
    obj["name"] = name;

    if (number != undefined) {
      if (!isvalid(number)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide number" });
      }
      if (!phoneRegex.test(number))
        return res.status(400).send({
          status: false,
          message: "please provide valid indian format number",
        });
      const numberData = await userModel.findOne({ number: number });
      if (numberData)
        return res
          .status(400)
          .send({ status: false, msg: `${number} is already present` });
      let getNumber = await userModel.findOne({ number: number });
      if (getNumber) {
        return res.status(400).send({
          status: false,
          message: "number is already in use, please enter a new one.",
        });
      }
    }
    obj["number"] = number;
    if (email != undefined) {
      if (!isvalid(email)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide email" });
      }
      if (!emailRegex.test(email))
        return res.status(400).send({
          status: false,
          message: "please provide valid indian format email",
        });
      const emailData = await userModel.findOne({ email: email });
      if (emailData)
        return res
          .status(400)
          .send({ status: false, msg: `${email} is already present` });
      let getemail = await userModel.findOne({ email: email });
      if (getemail) {
        return res.status(400).send({
          status: false,
          message: "email is already in use, please enter a new one.",
        });
      }
    }
    obj["email"] = email;

    if (password != undefined) {
      if (!isvalid(password)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide password" });
      }
      if (!passRegex.test(password))
        return res.status(400).send({
          status: false,
          message: "password should contain alphabets only.",
        });
      const passwordData = await userModel.findOne({ password: password });
      if (passwordData)
        return res
          .status(400)
          .send({ status: false, msg: `${password} is already present` });
      const saltRounds = 8;
      const encryptedPassword = await bcrypt.hash(password, saltRounds);
      obj["password"] = encryptedPassword;
    }
    if (address) {
      if (
        !isvalid(address.street) ||
        !isvalid(address.city) ||
        !isvalid(address.pincode)
      )
        return res.status(400).send({
          status: false,
          message: "Enter the street, city and pincode in the address.",
        });
      let pinValidated = pinValidator.validate(data.address.pincode);
      if (!pinValidated)
        return res
          .status(400)
          .send({ status: false, message: "Please enter a valid pincode." });
    }
    obj["address"] = address;
    if (userStatus) {
      obj["userStatus"] = userStatus;
    }
    let update = await userModel.findByIdAndUpdate(
      { _id: userId },
      { $set: obj },
      { new: true }
    );
    res.status(201).send({ status: true, message: "success", data: update });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const deleteUser = async function (req, res) {
  try {
    let userId = req.params.userId;
    const user = await userModel.findById(userId);
    if (user.length == 0) {
      return res.status(404).send({
        status: false,
        message: "No such user are found for this userId",
      });
    }
    if (user.isDeleted == true) {
      return res
        .status(400)
        .send({ status: false, message: "user is already deleted" });
    }
    await userModel.findOneAndUpdate(
      { _id: userId },
      { isDeleted: true, deletedAt: Date.now() }
    );
    return res
      .status(200)
      .send({ status: true, message: "user Deleted Successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { getData, updateUser, deleteUser };
