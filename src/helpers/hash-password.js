const bcrypt = require("bcryptjs");

function hashPassword(password) {
  const salt = 10;
  const hashed = bcrypt.hashSync(password, salt);
  return hashed;
}

function hashCompare(pass, hashpass) {
  const success = bcrypt.compareSync(pass, hashpass);
  return success;
}

module.exports = { hashPassword, hashCompare };
