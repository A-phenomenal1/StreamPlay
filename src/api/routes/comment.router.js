const {
  UniqueConstraintError,
  InvalidPropertyError,
  RequiredParameterError,
} = require("../../helpers/errors");
const makeHttpError = require("../../helpers/http-error");
const makeComment = require("../../models/comment.models");
const commentList = require("../../services/comment.service");

function makeCommentsEndpointHandler({ commentList }) {
  return async function handle(httpRequest) {
    console.log(httpRequest);
    switch (httpRequest.method) {
      case "POST":
        if (httpRequest.path === "/savecomment") {
          return saveComment(httpRequest);
        }

      case "GET":
        if (httpRequest.path === "/getcommentbyvideo")
          return getAllComment(httpRequest);

      case "PATCH":
        break;

      default:
        return makeHttpError({
          statusCode: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };

  //------------------------------------------------------------

  async function getAllComment(httpRequest) {
    const { id } = httpRequest.queryParams || {};
    let result;
    if (id) {
      result = await commentList.getCommentByVideoId({ videoId: id });
    } else {
      result = {
        success: 500,
        data: "id is not present",
      };
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

  async function saveComment(httpRequest) {
    let commentInfo = httpRequest.body;
    if (!commentInfo) {
      return makeHttpError({
        statusCode: 400,
        errorMessage: "Bad request. No POST body.",
      });
    }

    if (typeof commentInfo === "string") {
      try {
        commentInfo = JSON.parse(commentInfo);
      } catch {
        return makeHttpError({
          statusCode: 400,
          errorMessage: "Bad request. POST body must be valid JSON.",
        });
      }
    }

    try {
      const comment = makeComment(commentInfo);
      const result = await commentList.add(comment);
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
}

const commentsEndpointHandler = makeCommentsEndpointHandler({ commentList });

module.exports = commentsEndpointHandler;
