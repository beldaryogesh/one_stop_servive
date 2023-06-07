const isvalid = function (value) {
  if (typeof value === "undefined" || value === "null") return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isValidRequestBody = function (reqBody) {
  if (!Object.keys(reqBody).length) {
    return false;
  }
  return true;
};

let nameRegex = /^[.a-zA-Z\s]+$/;
let phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
let emailRegex =
  /^[a-z]{1}[a-z0-9._]{1,100}[@]{1}[a-z]{2,15}[.]{1}[a-z]{2,10}$/;
let passRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;

module.exports = {
  isvalid,
  nameRegex,
  phoneRegex,
  emailRegex,
  passRegex,
  isValidRequestBody,
};
