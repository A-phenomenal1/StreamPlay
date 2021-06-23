const {
  UniqueConstraintError,
  InvalidPropertyError,
  RequiredParameterError,
} = require("../../helpers/errors");
const makeHttpError = require("../../helpers/http-error");
const makeVideo = require("../../models/video.models");
const videoList = require("../../services/video.service");
const cloudinary = require("cloudinary");

function makeVideosEndpointHandler({ videoList }) {
  return async function handle(httpRequest) {
    console.log(httpRequest);
    switch (httpRequest.method) {
      case "POST":
        if (httpRequest.path === "/uploadvideo") {
          return uploadVideo(httpRequest);
        } else if (httpRequest.path === "/api/uploadvideofile") {
          return uploadVideoFile(httpRequest);
        }

      case "GET":
        if (httpRequest.path === "/getallvideo")
          return getAllVideo(httpRequest);
        else if (httpRequest.path === "/gettrendvideos")
          return getTrendVideos();
        else if (httpRequest.path === "/getfiltervideos")
          return getFilterVideos(httpRequest);
        else if (httpRequest.path === "/searchvideo")
          return searchVideo(httpRequest);
        else if (httpRequest.path === "/searchvideobysubs")
          return searchVideoBySubsc(httpRequest);
        else return getVideo(httpRequest);

      case "PATCH":
        if (httpRequest.path === "/updateevents")
          return updateEvents(httpRequest);

      default:
        return makeHttpError({
          statusCode: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };

  //------------------------------------------------------------

  async function getVideo(httpRequest) {
    const { id } = httpRequest.pathParams || {};
    let result;
    if (id) {
      result = await videoList.findById({ videoId: id });
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

  async function uploadVideo(httpRequest) {
    let videoInfo = httpRequest.body;
    if (!videoInfo) {
      return makeHttpError({
        statusCode: 400,
        errorMessage: "Bad request. No POST body.",
      });
    }

    if (typeof httpRequest.body === "string") {
      try {
        videoInfo = JSON.parse(videoInfo);
      } catch {
        return makeHttpError({
          statusCode: 400,
          errorMessage: "Bad request. POST body must be valid JSON.",
        });
      }
    }

    try {
      const video = makeVideo(videoInfo);
      console.log("video: ", video);
      const result = await videoList.add(video);
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

  async function uploadVideoFile(httpRequest) {
    if (httpRequest.file !== undefined) {
      try {
        const result = await cloudinary.v2.uploader.upload(
          httpRequest.file.path,
          { resource_type: "video" }
        );
        console.log("result:", result);
        return {
          statusCode: 200,
          data: JSON.stringify({
            success: 200,
            filePath: result.url,
            fileName: result.original_filename,
            filePathInDisk: httpRequest.file.path,
          }),
        };
      } catch (error) {
        return {
          statusCode: 500,
          data: {
            success: 500,
            error: `failed to upload video!!!. Error: ${error}`,
          },
        };
      }
    }
  }

  //------------------------------------------------------------

  async function getAllVideo(httpRequest) {
    const { page, limit } = httpRequest.queryParams || {};
    const result = await videoList.getVideoByPrivacy(page, limit);
    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: result.success,
      data: result,
    };
  }

  //-----------------------------------------------------------

  async function getFilterVideos(httpRequest) {
    const { filter, page, limit } = httpRequest.queryParams || {};
    console.log(filter, page, limit);
    const result = await videoList.getVideoByFilter(filter, page, limit);
    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: result.success,
      data: result,
    };
  }

  //-----------------------------------------------------------

  async function getTrendVideos() {
    const result = await videoList.getVideoByTrend();
    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: result.success,
      data: result,
    };
  }

  //-----------------------------------------------------------

  async function searchVideo(httpRequest) {
    const { searchKey } = httpRequest.queryParams || {};
    console.log("in searchVideo routes", searchKey);

    if (searchKey.length >= 2) {
      let regex = new RegExp(searchKey, "i");
      const result = await videoList.findByTitle({ searchKey: regex });
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: result.success,
        data: result,
      };
    } else {
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 500,
        data: "give some more hint",
      };
    }
  }

  //------------------------------------------------------------

  async function searchVideoBySubsc(httpRequest) {
    const { id } = httpRequest.queryParams || {};
    let result;
    if (id) {
      result = await videoList.getVideoByUser({
        userId: id,
        privacy: "Public",
      });
      console.log("video by user id: ", id, { result });
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
      data: "Invalid Id",
    };
  }

  //------------------------------------------------------------

  async function updateEvents(httpRequest) {
    const { id, userId } = httpRequest.queryParams || {};
    const { newValue } = httpRequest.body;
    console.log("in updateEvents function", newValue);

    if (id) {
      if (typeof newValue === "object")
        result = await videoList.updateThumbEvents({
          userId,
          videoId: id,
          newValue,
        });
      else if (typeof newValue === "number")
        result = await videoList.updateViews({ videoId: id, newValue });
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

const videosEndpointHandler = makeVideosEndpointHandler({ videoList });

module.exports = videosEndpointHandler;
