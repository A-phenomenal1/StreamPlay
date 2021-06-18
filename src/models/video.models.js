const requiredParam = require("../helpers/required-param");
const { InvalidPropertyError } = require("../helpers/errors");
const upperFirst = require("../helpers/upper-first");
const formatDate = require("../helpers/format-date");
const formatDuration = require("../helpers/format-duration");

function makeVideo(videoInfo = requiredParam("videoInfo")) {
  console.log("videoInfo: ", videoInfo);
  const validVideo = validate(videoInfo);
  const normalVideo = normalize(validVideo);
  return Object.freeze(normalVideo);

  function validate({
    writer = requiredParam("writer"),
    title = requiredParam("title"),
    description = requiredParam("description"),
    privacy = requiredParam("privacy"),
    filePath = requiredParam("filePath"),
    category = requiredParam("category"),
    views = requiredParam("views"),
    likes = requiredParam("likes"),
    dislikes = requiredParam("dislikes"),
    duration = requiredParam("duration"),
    thumbnail = requiredParam("thumbnail"),
    ...otherInfo
  } = {}) {
    validateParam("writer", writer);
    validateParam("title", title);
    validateParam("description", description);
    validateParam("privacy", privacy);
    validateParam("filePath", filePath);
    validateParam("views", views);
    validateParam("likes", likes);
    validateParam("dislikes", dislikes);
    validateParam("duration", duration);
    validateParam("thumbnail", thumbnail);
    validateParam("category", category);
    return {
      writer,
      title,
      description,
      privacy,
      filePath,
      views,
      likes,
      dislikes,
      duration,
      thumbnail,
      category,
      ...otherInfo,
    };
  }

  function validateParam(label, value) {
    switch (label) {
      case "writer":
        if (typeof value !== "object") {
          throw new InvalidPropertyError(`A video's ${label} must a object.`);
        }
        break;
      case "title":
        if (typeof value !== "string")
          throw new InvalidPropertyError(`A video's ${label} must a string.`);
        if (value.length < 10)
          throw new InvalidPropertyError(
            `A video's ${label} must at least 10 charachters long.`
          );
        break;
      case "description":
        if (typeof value !== "string")
          throw new InvalidPropertyError(`A video's ${label} must a string.`);
        if (value.length < 20)
          throw new InvalidPropertyError(
            `A video's ${label} must at least 20 charachters long.`
          );
        break;
      case "privacy":
        if (typeof value !== "string")
          throw new InvalidPropertyError(`A video's ${label} must a string.`);
        break;
      case "filePath":
        if (typeof value !== "string")
          throw new InvalidPropertyError(`A video's ${label} must a string.`);
        break;
      case "views":
        if (typeof value !== "number")
          throw new InvalidPropertyError(`A video's ${label} must a number.`);
        break;
      case "likes":
        if (typeof value !== "number")
          throw new InvalidPropertyError(`A video's ${label} must a number.`);
        break;
      case "dislikes":
        if (typeof value !== "number")
          throw new InvalidPropertyError(`A video's ${label} must a number.`);
        break;
      case "duration":
        if (typeof value !== "number" && typeof value !== "string")
          throw new InvalidPropertyError(
            `A video's ${label} must a number or string. ${value}`
          );
        break;
      case "thumbnail":
        if (typeof value !== "string")
          throw new InvalidPropertyError(`A video's ${label} must a string.`);
        break;
      case "category":
        if (typeof value !== "string")
          throw new InvalidPropertyError(`A video's ${label} must a string.`);
        break;
    }
  }

  function normalize({
    writer,
    title,
    description,
    privacy,
    filePath,
    views,
    likes,
    dislikes,
    duration,
    thumbnail,
    category,
    updatedAt,
    ...otherInfo
  }) {
    return {
      updatedAt: formatDate(updatedAt),
      title: upperFirst(title),
      description: upperFirst(description),
      duration: formatDuration(duration),
      writer,
      privacy,
      filePath,
      views,
      likes,
      dislikes,
      thumbnail,
      category,
      ...otherInfo,
    };
  }
}

module.exports = makeVideo;
