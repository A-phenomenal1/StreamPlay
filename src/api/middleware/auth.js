const jwt = require("jsonwebtoken");
const makeHttpError = require("../../helpers/http-error");

const secret = "LB-store";

const authorization = function (req, res, next) {
  const token = req.headers["auth-token"];
  console.log("token:", token);
  let msg = { auth: false, message: "No token provided." };
  if (!token) {
    return makeHttpError({
      statusCode: 500,
      errorMessage: msg,
    });
  }
  jwt.verify(token, secret, (err, decoded) => {
    msg = { auth: false, message: "Failed to authenticate token." };
    if (err) {
      return makeHttpError({
        statusCode: 500,
        errorMessage: msg,
      });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authorization;
