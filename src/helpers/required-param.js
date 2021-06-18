const { RequiredParameterError } = require("./errors");

function requiredParam(param) {
  throw new RequiredParameterError(param);
}

module.exports = requiredParam;
