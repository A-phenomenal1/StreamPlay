const jwt = require("jsonwebtoken");
const { default: jwtDecode } = require("jwt-decode");

const secret = "LB-store";

function createToken(id, expiretime = "7d") {
  let token = jwt.sign({ id }, secret, {
    expiresIn: expiretime,
  });
  return token;
}

function decodeToken(token) {
  let decoded = jwtDecode(token);
  return decoded.id;
}

module.exports = { createToken, decodeToken };
