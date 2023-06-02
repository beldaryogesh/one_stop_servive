const Admin = require("../models/adminModel");
const userModel = require("../models/userModel")
const pinValidator = require("pincode-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  isvalid,
  isValidRequestBody,
  nameRegex,
  emailRegex,
  passRegex,
  phoneRegex,
} = require("../validations/validation");



const createAdmin = async function (req, res) {
  let data = req.body;
  if (!isValidRequestBody(data)) {
    return res
      .status(400)
      .send({ message: "please provide data for admin Creation" });
  }
  let { name, number, email, password, address, userType } = data;
  let obj = {};
  if (!isvalid(name)) {
    return res
      .status(400)
      .send({ status: false, message: "please provide name" });
  }
  if (!nameRegex.test(name)) {
    return res
      .status(400)
      .send({ status: false, message: "name should contain alphabets only." });
  }
  obj["name"] = name;
  if (!isvalid(number)) {
    return res
      .status(400)
      .send({ status: false, message: "please provide number" });
  }
  if (!phoneRegex.test(number)) {
    return res.status(400).send({
      status: false,
      message: "Enter the phone number in valid Indian format.",
    });
  }
  obj["number"] = number;
  if (!isvalid(email)) {
    return res
      .status(400)
      .send({ status: false, message: "please provide emailId" });
  }
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .send({ status: false, message: "please provide valid emailId" });
  }
  obj["email"] = email;
  if (!isvalid(password)) {
    return res
      .status(400)
      .send({ status: false, message: "please provide password" });
  }
  if (!passRegex.test(password)) {
    return res.status(400).send({
      status: false,
      message:
        "Password length should be alphanumeric with 8-15 characters, should contain at least one lowercase, one uppercase and one special character.",
    });
  }
  const saltRounds = 8;
  const encryptedPassword = await bcrypt.hash(password, saltRounds);
  obj["password"] = encryptedPassword;

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
  if(!isvalid(userType)){
    return res.status(400).send({status : false, message : "please provide userType"})
  }
  obj["userType"] = userType;

  const createAdmin = await userModel.create(obj);
  return res.status(201).send({
    status: false,
    message: "admin created successfully",
    data: createAdmin,
  });
};


const adminLogin = async function (req, res) {
  try {
    const data = req.body
    const { email, password } = data
    if (!isValidRequestBody(data))    
      return res.status(400).send({ status: false, message: "please Provide the login credentials in body." })
    if (!isvalid(email)) 
      return res.status(400).send({ status: false, message: "Please enter the email." })
    if (!emailRegex.test(email))   
      return res.status(400).send({ status: false, message: "Please enter a valid emailId." })
    if (!isvalid(password)) {  
      return res.status(400).send({ status: false, message: "Please enter Password should be Valid min 8 and max 15 length" });
    }
    if (!passRegex.test(password))   
      return res.status(400).send({ status: false, message: "Password length should be alphanumeric with 8-15 characters, should contain at least one lowercase, one uppercase and one special character." })
    const admin = await userModel.findOne({ email: email });
    if (!admin) {
      return res.status(404).send({ status: false, msg: "Invalid admin" })
    }
    if(!(admin.userType === 'admin')){
      return res.status(403).send({status : false, message : "only admin access this Api for login"})
    }
    const decrypPassword = admin.password
    const pass = await bcrypt.compare(password, decrypPassword)
    if (!pass) {
      return res.status(400).send({ status: false, message: "Password Incorrect" })
    }
    return res.status(200).send({ status: true, msg: "Admin LoggedIn Succesfully"})
  }
  catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}



module.exports = { createAdmin, adminLogin };



