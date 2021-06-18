const requiredParam = require("../helpers/required-param");
const { InvalidPropertyError } = require("../helpers/errors");
const isValidEmail = require("../helpers/is-valid-email.js");
const upperFirst = require("../helpers/upper-first");
const { hashPassword } = require("../helpers/hash-password");

function makeUser(userInfo = requiredParam("userInfo")) {
  console.log("userInfo: ", userInfo);
  const validUser = validate(userInfo);
  const normalUser = normalize(validUser);
  return Object.freeze(normalUser);

  function validate({
    firstName = requiredParam("firstName"),
    lastName = requiredParam("lastName"),
    email = requiredParam("email"),
    password = requiredParam("password"),
    ...otherInfo
  } = {}) {
    validateName("firstName", firstName);
    validateName("lastName", lastName);
    validateEmail(email);
    // validatePassword(password, cnfpassword);
    return { firstName, lastName, email, password, ...otherInfo };
  }

  function validateName(label, name) {
    if (name.length < 2) {
      throw new InvalidPropertyError(
        `A user's ${label} must be at least 3 characters long.`
      );
    }
  }

  function validateEmail(emailAddress) {
    if (!isValidEmail(emailAddress)) {
      throw new InvalidPropertyError("Invalid contact email address.");
    }
  }

  // function validatePassword(password, ...otherInfo) {
  //   console.log(otherInfo);
  //   let otherinfo = { ...otherInfo };
  //   if (password !== otherinfo.cnfpassword) {
  //     throw new InvalidPropertyError(
  //       "Password and Confirm Password is different"
  //     );
  //   }
  // }

  function normalize({ firstName, lastName, email, password, ...otherInfo }) {
    return {
      ...otherInfo,
      firstName: upperFirst(firstName),
      lastName: upperFirst(lastName),
      email: email.toLowerCase(),
      password: hashPassword(password),
    };
  }
}

module.exports = makeUser;
