const userModel = require("../models/userModel");
const pinValidator = require("pincode-validator");
const serviceModel = require("../models/serviceModel");

const {
  isvalid,
  nameRegex,
  phoneRegex,
  emailRegex,
  passRegex,
  isValidRequestBody,
} = require("../validations/validation");

const getData = async function (req, res) {
  try {
    let filters = req.query.userType;
    let serviceName = req.query.serviceName
    if(filters !== undefined){
    let userDetails = await userModel.find({ userType: filters });
    if (userDetails.length == 0) {
      return res.status(404).send({
        status: false,
        message: "No such user found in the database for this userType",
      });
    }
    return res
      .status(200)
      .send({ status: true, message: "user list", data: userDetails });
  }else if(serviceName !== undefined){
    let sellerDetails = await serviceModel.find({serviceName : serviceName})
      if(sellerDetails.length == 0){
        return res.status(404).send({status : false, message :`No such user found in the database for this ${serviceName}` })
      }
      return res.status(200).send({
        status: false,
        message: "seller list",
        data : sellerDetails
      })

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
    let bodyFromReq = JSON.parse(JSON.stringify(data));
    let obj = {};
    if (bodyFromReq.hasOwnProperty("name")) {
      if (!isvalid(name)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide name" });
      }
      if (!nameRegex.test(name))
        return res
          .status(400)
          .send({
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

    if (bodyFromReq.hasOwnProperty("number")) {
      if (!isvalid(number)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide number" });
      }
      if (!phoneRegex.test(number))
        return res
          .status(400)
          .send({
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
    if (bodyFromReq.hasOwnProperty("email")) {
        if (!isvalid(email)) {
          return res
            .status(400)
            .send({ status: false, msg: "please provide email" });
        }
        if (!emailRegex.test(email))
          return res
            .status(400)
            .send({
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
   
    
      if (bodyFromReq.hasOwnProperty("password")) {
        if (!isvalid(password)) {
          return res
            .status(400)
            .send({ status: false, msg: "please provide password" });
        }
        if (!passRegex.test(password))
          return res
            .status(400)
            .send({
              status: false,
              message: "password should contain alphabets only.",
            });
        const passwordData = await userModel.findOne({ password: password });
        if (passwordData)
          return res
            .status(400)
            .send({ status: false, msg: `${password} is already present` });
      }
    obj["password"] = password;
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
      let user_new = await userModel.find({ userId });
      if (user_new.userType === "admin") {
        obj["userStatus"] = userStatus;
      }
    }
    let updateData = await userModel.findByIdAndUpdate({_id:userId}, {$set : obj} ,{new: true})
     res
      .status(201)
      .send({ status: true, message: "success", data: updateData });
      user.save();
  } catch (error) {
    return res.status(500).send({ status: false, message: "Error" });
  }
};

const deleteUser = async function(req, res) {
  try {
    let userId = req.params.userId;
    const user = await userModel.findById(userId);
    if(user.length == 0){
      return res.status(404).send({status : false, message : 'No such user are found for this userId'})
    }
    if(user.isDeleted == true){
      return res.status(400).send({status : false, message : "user is already deleted"})
    }
    await userModel.findOneAndUpdate(
      { _id: userId },
      { isDeleted: true, deletedAt: Date.now() }
    );
    return res.status(200).send({status : true , message : "user Deleted Successfully"})
    
  } catch (error) {
    return res.status(500).send({status : false, message : error.message})
  }
}


module.exports = { getData, updateUser, deleteUser};








