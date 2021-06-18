const {
  UniqueConstraintError,
  InvalidPropertyError,
  RequiredParameterError,
} = require("../../helpers/errors");
const { hashCompare } = require("../../helpers/hash-password");
const makeHttpError = require("../../helpers/http-error");
const { createToken } = require("../../helpers/json-web-token");
const makeUser = require("../../models/user.models");
const userList = require("../../services/user.service");

function makeUsersEndpointHandler({ userList }) {
  return async function handle(httpRequest) {
    console.log(httpRequest);
    switch (httpRequest.method) {
      case "POST":
        if (httpRequest.path === "/signup") {
          return createUser(httpRequest);
        } else if (httpRequest.path === "/login") {
          return loginUser(httpRequest);
        } else if (httpRequest.path === "/sendmail") {
          return sendEmail(httpRequest);
        } else if (httpRequest.path === "/api/uploadprofilepic") {
          return uploadPic(httpRequest);
        }

      case "GET":
        return getUser(httpRequest);

      case "PATCH":
        if (httpRequest.path === "/updatesubscriber") {
          return updateSubscriberList(httpRequest);
        }

      default:
        return makeHttpError({
          statusCode: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };

  //------------------------------------------------------------

  async function getUser(httpRequest) {
    const { id } = httpRequest.pathParams || {};
    const { max, before, after, email } = httpRequest.queryParams || {};

    if (id) {
      result = await userList.findById({ userId: id });
      delete result.password;
      delete result.email;
      delete result.subscribedTo;
      delete result.likedVideos;
      console.log("result: ", result);
    } else if (email) {
      result = await userList.findByEmail({ email });
    } else {
      result = await userList.getItems({ max, before, after });
    }

    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 200,
      data: JSON.stringify(result),
    };
  }

  //------------------------------------------------------------

  async function createUser(httpRequest) {
    let userInfo = httpRequest.body;
    if (!userInfo) {
      return makeHttpError({
        statusCode: 400,
        errorMessage: "Bad request. No POST body.",
      });
    }

    if (typeof httpRequest.body === "string") {
      try {
        userInfo = JSON.parse(userInfo);
      } catch {
        return makeHttpError({
          statusCode: 400,
          errorMessage: "Bad request. POST body must be valid JSON.",
        });
      }
    }

    try {
      const user = makeUser(userInfo);
      console.log("user: ", user);
      const result = await userList.add(user);
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 201,
        data: result,
      };
    } catch (e) {
      return makeHttpError({
        errorMessage: e.message,
        statusCode:
          e instanceof UniqueConstraintError
            ? 409
            : e instanceof InvalidPropertyError ||
              e instanceof RequiredParameterError
            ? 400
            : 500,
      });
    }
  }

  //------------------------------------------------------------

  async function loginUser(httpRequest) {
    let loginInfo = httpRequest.body;
    if (loginInfo.email === undefined) {
      return makeHttpError({
        statusCode: 400,
        errorMessage: "Bad request. No POST body.",
      });
    }

    if (typeof httpRequest.body === "string") {
      try {
        loginInfo = JSON.parse(loginInfo);
      } catch {
        return makeHttpError({
          statusCode: 400,
          errorMessage: "Bad request. POST body must be valid JSON.",
        });
      }
    }

    try {
      result = await userList.findByEmail({ email: loginInfo.email });
      console.log(result);
      if (result.length === 0) {
        return makeHttpError({
          statusCode: 401,
          errorMessage: "Non Authenticated User",
        });
      }
      let isMatch = hashCompare(loginInfo.password, result[0].password);
      if (isMatch) {
        let Access_Token = createToken(result[0]._id, "1h");
        let Session_Token = createToken(Access_Token);
        console.log("SessionToken: ", Session_Token);
        return {
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 200,
          data: JSON.stringify(Session_Token),
        };
      }
      return makeHttpError({
        statusCode: 401,
        errorMessage: "Username or Password is wrong",
      });
    } catch (e) {
      return makeHttpError({
        errorMessage: e.message,
        statusCode:
          e instanceof UniqueConstraintError
            ? 409
            : e instanceof InvalidPropertyError ||
              e instanceof RequiredParameterError
            ? 400
            : 500,
      });
    }
  }

  //------------------------------------------------------------

  async function uploadPic(httpRequest) {
    if (httpRequest.file !== undefined) {
      return {
        statusCode: 200,
        data: JSON.stringify({
          success: 200,
          filePath: httpRequest.file.path,
          fileName: httpRequest.file.filename,
        }),
      };
    }
    return {
      statusCode: 500,
      data: {
        success: 500,
        error: "failed to upload picture!!!",
      },
    };
  }

  //------------------------------------------------------------

  async function sendEmail(httpRequest) {
    console.log("body in sendEmail: ", httpRequest.body);
    let result;
    if (httpRequest.body) {
      result = await userList.sentMail({ body: httpRequest.body });
      console.log("result: ", result);
    }
    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: result.success,
      data: JSON.stringify(result),
    };
  }

  //------------------------------------------------------------

  async function updateSubscriberList(httpRequest) {
    const { id } = httpRequest.queryParams || {};
    const { updateKey, newValue } = httpRequest.body;
    let result;

    if (id) {
      result = await userList.update({ userId: id, updateKey, newValue });
      console.log({ result });
    }
    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: result.success,
      data: JSON.stringify(result),
    };
  }

  //------------------------------------------------------------
}

const usersEndpointHandler = makeUsersEndpointHandler({ userList });

module.exports = usersEndpointHandler;
