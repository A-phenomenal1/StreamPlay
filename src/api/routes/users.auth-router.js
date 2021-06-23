const makeHttpError = require("../../helpers/http-error");
const { decodeToken } = require("../../helpers/json-web-token");
const userList = require("../../services/user.service");
const videoList = require("../../services/video.service");

function makeAuthUsersEndpointHandler({ userList }) {
  return async function handle(httpRequest) {
    console.log("httpRequest: ", httpRequest);
    switch (httpRequest.method) {
      case "POST":
        break;

      case "GET":
        if (httpRequest.path === "/getallvideo") {
          return getAllVideo(httpRequest);
        }
        return getLoginUser(httpRequest);

      case "PATCH":
        if (httpRequest.path === "/updateprofile") {
          return updateProfile(httpRequest);
        } else if (httpRequest.path === "/updatevideowriter") {
          return updateVideoWriter(httpRequest);
        } else if (httpRequest.path === "/updatecommentwriter")
          return updateCommentWriter(httpRequest);
        break;

      default:
        return makeHttpError({
          statusCode: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };

  async function getAllVideo(httpRequest) {
    let id = decodeToken(httpRequest.user.id);
    let result;
    if (id) {
      result = await videoList.getVideoByUser({ userId: id, privacy: "" });
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: result.success,
        data: JSON.stringify(result),
      };
    }
    return {
      statusCode: result.success,
      data: "Not valid user",
    };
  }

  async function getLoginUser(httpRequest) {
    let userId = decodeToken(httpRequest.user.id);
    if (userId) {
      result = await userList.findById({ userId });
      if (result.length !== 0)
        return {
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 200,
          data: JSON.stringify(result),
        };
      else
        return makeHttpError({
          statusCode: 401,
          errorMessage: "Non Authenticated User",
        });
    }
  }

  async function updateProfile(httpRequest) {
    const userId = decodeToken(httpRequest.user.id);
    console.log("values: ", httpRequest.body);
    if (userId) {
      let result = await userList.updateUser({
        userId,
        values: httpRequest.body,
      });
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
        data: JSON.stringify(result),
      };
    }
    return {
      statusCode: 500,
      data: "user not found",
    };
  }

  async function updateVideoWriter(httpRequest) {
    const userId = decodeToken(httpRequest.user.id);
    console.log("user in update video writer: ", httpRequest.body);
    if (userId) {
      const result = await userList.replaceWriters({
        collection: "videos",
        userId,
        newUser: httpRequest.body,
      });
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
        data: JSON.stringify(result),
      };
    }
    return {
      statusCode: 500,
      data: "user updation not successfull",
    };
  }

  async function updateCommentWriter(httpRequest) {
    const userId = decodeToken(httpRequest.user.id);
    console.log("user in update comment writer: ", httpRequest.body);
    if (userId) {
      const result = await userList.replaceWriters({
        collection: "comments",
        userId,
        newUser: httpRequest.body,
      });
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
        data: JSON.stringify(result),
      };
    }
    return {
      statusCode: 500,
      data: "user updation not successfull",
    };
  }
}

const authUsersEndpointHandler = makeAuthUsersEndpointHandler({ userList });

module.exports = authUsersEndpointHandler;
