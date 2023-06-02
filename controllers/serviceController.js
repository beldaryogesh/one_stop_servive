const serviceModel = require("../models/serviceModel");
const {
  isvalid,
  isValidRequestBody,
  nameRegex,
  phoneRegex,
} = require("../validations/validation");
const userModel = require("../models/userModel");

const addService = async function (req, res) {
  try {
    let userId = req.params.userId;

    let data = req.body;
    if (!isValidRequestBody(data)) {
      return res.status(400).send({
        status: false,
        message: "please provide data for add service",
      });
    }

    let { serviceName, description, number } = data;
    data["userId"] = userId;

    if (!isvalid(serviceName)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide service name" });
    }
    if (!nameRegex.test(serviceName)) {
      return res.status(400).send({
        status: false,
        message: "service name should contain alphabets only.",
      });
    }

    if (!isvalid(description)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide discription" });
    }

    if (!isvalid(number)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide number" });
    }
    if (!phoneRegex.test(number)) {
      return res.status(400).send({
        status: false,
        message: "please provide valid indian format number",
      });
    }
    let serviceData = await serviceModel.find({ userId: userId });
    if (serviceData.isDeleted == false) {
      serviceData.forEach((el) => {
        if (el.userId == userId && el.serviceName == serviceName) {
          return res.status(400).send({
            status: false,
            message:
              "you are already providing this service please provide unique service",
          });
        }
      });
    }
    let sellerData = await userModel.findById(userId);
    if (sellerData.isDeleted == true) {
      return res
        .status(400)
        .send({
          status: false,
          message: "This seller is deleted, you can't add service",
        });
    }
    if (!(sellerData.userType == "seller")) {
      return res
        .status(400)
        .send({ status: false, message: "only seller can access this api" });
    }
    if (!(sellerData.userStatus == "verified")) {
      return res.status(400).send({
        status: false,
        message:
          "you need to verify user status than you are eligible to add service",
      });
    }
    data["sellerName"] = sellerData.name;

    const addServices = await serviceModel.create(data);
    addServices.save();
    const user = await userModel.findById(userId);
    user.userServices.push(addServices._id);
    user.save();
    return res.status(201).send({
      status: true,
      message: `${serviceName} service added successfully`,
      data: addServices,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getAllService = async function (req, res) {
  try {
    const allData = await serviceModel.find({});
    return res.json({ data: allData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getService = async function (req, res) {
  try {
    let data = req.query;

    if (!isValidRequestBody(data)) {
      return res.status(400).send({
        status: false,
        message: "please provide query for searching services",
      });
    }
    let { serviceName } = data;
    if (!isvalid(serviceName)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide service name" });
    }
    if (!nameRegex.test(serviceName)) {
      return res.status(400).send({
        status: false,
        message: "service name should contain alphabets only.",
      });
    }
    const serviceData = await serviceModel.find({ serviceName: serviceName });
    if (serviceData.length === 0) {
      return res.status(404).send({
        status: false,
        message: `No such similar service are find by the ${serviceName}`,
      });
    }
    return res.status(200).send({
      status: true,
      message: `this following services are available for ${serviceName} `,
      data: serviceData,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getSellerData = async function (req, res) {
  try {
    let serviceName = req.query.serviceName;
    if (!isvalid(serviceName)) {
      return res.status(400).send({
        status: false,
        message: "please provide service name for search seller list",
      });
    }
    if (!nameRegex.test(serviceName)) {
      return res.status(400).send({
        status: false,
        message: "service name should contain alphabets only. ",
      });
    }
    let sellerDetails = await serviceModel.find({ serviceName: serviceName });

    if (sellerDetails.length == 0) {
      return res.status(404).send({
        status: false,
        message: `${serviceName} service is not provided by any seller`,
      });
    }
    return res
      .status(200)
      .send({ status: true, message: "seller list", data: sellerDetails });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const updateService = async function (req, res) {
  try {
    let data = req.body;
    let serviceId = req.params.serviceId;

    const service = await serviceModel.findById(serviceId);
    const user = await userModel.findById(service.userId);
    if (user.isDeleted == true) {
      return res
        .status(400)
        .send({
          status: false,
          message: "This seller is deleted, you can't update service",
        });
    }
    if (user.userType !== "seller") {
      return res
        .status(400)
        .send({ status: false, message: "only seller can access this api" });
    }
    if (service.isDeleted == true) {
      return res.status(400).send({
        status: false,
        message: "this service has been deleted , you cannot update",
      });
    }
    let { serviceName, description, number } = data;
    let bodyFromReq = JSON.parse(JSON.stringify(data));

    let obj = {};
    if (service.serviceName == serviceName) {
      return res
        .status(400)
        .send({ status: false, message: "please provide unique service name" });
    }
    if (service.description == description) {
      return res
        .status(400)
        .send({ status: false, message: "please provide unique description" });
    }
    if (service.number == number) {
      return res
        .status(400)
        .send({ status: false, message: "please provide unique Number" });
    }
    if (bodyFromReq.hasOwnProperty("serviceName")) {
      if (!isvalid(serviceName)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide service Name" });
      }
      if (!nameRegex.test(serviceName)) {
        return res.status(400).send({
          status: false,
          message: "service Name should contain alphabets only. ",
        });
      }
    }

    obj["serviceName"] = serviceName;
    if (bodyFromReq.hasOwnProperty("description")) {
      if (!isvalid(description)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide description" });
      }
    }
    obj["description"] = description;
    if (bodyFromReq.hasOwnProperty("number")) {
      if (!isvalid(number)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide Number" });
      }
      if (!phoneRegex.test(number)) {
        return res.status(400).send({
          status: false,
          message: "please provide valid indian format Number ",
        });
      }
    }
    obj["number"] = number;

    let update = await serviceModel.findByIdAndUpdate(
      { _id: serviceId },
      { $set: obj },
      { new: true }
    );

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const deleteService = async function (req, res) {
  try {
    let serviceId = req.params.serviceId;
    let service = await serviceModel.findById(serviceId);
    let user = await userModel.findById(service.userId);
    let index = 0;
    if (user.userType !== "seller") {
      return res.status.send({
        status: false,
        message: "only seller can access this Api",
      });
    }

    if (!service) {
      return res
        .status(404)
        .send({ status: false, message: "service is not found" });
    }
    if (service.isDeleted == true) {
      return res
        .status(400)
        .send({ status: false, message: "this service is already deleted" });
    }

    await serviceModel.findOneAndUpdate(
      { _id: serviceId },
      { isDeleted: true, deletedAt: Date.now() }
    );

    for (let userId of user["userServices"]) {
      if (userId == serviceId) break;
      index++;
    }
    user["userServices"].splice(index, 1);
    user.save();
    return res
      .status(200)
      .send({ status: true, message: "service deleted succesfully." });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  addService,
  getAllService,
  getService,
  getSellerData,
  updateService,
  deleteService,
};
