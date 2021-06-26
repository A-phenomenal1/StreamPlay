const requiredParam = require("../helpers/required-param");
const { InvalidPropertyError } = require("../helpers/errors");
const upperFirst = require("../helpers/upper-first");
// const formatDate = require("../helpers/format-date");
// const formatDuration = require("../helpers/format-duration");

function makeComment(commentInfo = requiredParam("videoInfo")) {
  console.log("commentInfo in modals: ", commentInfo);
  const validComment = validate(commentInfo);
  const normalComment = normalize(validComment);
  return Object.freeze(normalComment);

  function validate({
    writer = requiredParam("writer"),
    text = requiredParam("text"),
    postId = requiredParam("postId"),
    replyToId = requiredParam("replayToId"),
    ...otherInfo
  } = {}) {
    validateParam("writer", writer);
    validateParam("text", text);
    validateParam("postId", postId);
    validateParam("replyToId", replyToId);
    return {
      writer,
      text,
      postId,
      replyToId,
      ...otherInfo,
    };
  }

  function validateParam(label, value) {
    switch (label) {
      case "writer":
        if (typeof value !== "object") {
          throw new InvalidPropertyError(`A comment's ${label} must a object.`);
        }
        break;
      case "text":
        if (typeof value !== "string")
          throw new InvalidPropertyError(`A comment's ${label} must a string.`);
        if (value.length < 2)
          throw new InvalidPropertyError(
            `A comment's ${label} must at least 2 charachters long.`
          );
        break;
      case "postId":
        if (typeof value !== "string")
          throw new InvalidPropertyError(`A comment's ${label} must a string.`);
        break;
      case "replyToId":
        if (value !== null) {
          if (typeof value !== "string")
            throw new InvalidPropertyError(
              `A comment's ${label} must a string.`
            );
        }
        break;
    }
  }

  function normalize({ writer, text, postId, replyToId, ...otherInfo }) {
    return {
      writer,
      text: upperFirst(text),
      postId,
      replyToId,
      ...otherInfo,
    };
  }
}

module.exports = makeComment;
