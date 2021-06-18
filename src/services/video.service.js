const makeVideo = require("../models/video.models");
const database = require("../db");
const formatDate = require("../helpers/format-date");

function makeVideoList() {
  return Object.freeze({
    add,
    getVideoByPrivacy,
    getVideoByUser,
    getVideoByTrend,
    findById,
    findByTitle,
    updateThumbEvents,
    updateViews,
  });

  //------------------------------------------------------------

  async function add({ videoId, ...video }) {
    const db = await database;
    if (videoId) {
      video._id = db.makeId(videoId);
    }

    const { result, ops } = await db
      .collection("videos")
      .insertOne(video)
      .catch((mongoError) => {
        console.log("mongoError: ", mongoError);
        throw mongoError;
      });
    return {
      success: 201,
      created: documentToContact(ops[0]),
    };
  }

  //------------------------------------------------------------

  async function getVideoByPrivacy(p, l) {
    const db = await database;
    const size = await db.collection("videos").countDocuments();
    const page = parseInt(p);
    const limit = parseInt(l);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < size) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    results.results = await db
      .collection("videos")
      .find({ privacy: "Public" })
      .limit(limit)
      .skip(startIndex)
      .toArray()
      .catch((error) => {
        return {
          success: 500,
          error: error,
        };
      });
    return {
      success: 200,
      videos: results,
    };
  }

  //------------------------------------------------------------

  async function getVideoByUser({ userId, privacy }) {
    console.log("userId: ", userId);
    const db = await database;
    let results;
    if (privacy !== "")
      results = await db
        .collection("videos")
        .find({ "writer._id": userId, privacy: "Public" })
        .toArray()
        .catch((error) => {
          return {
            success: 500,
            error: error,
          };
        });
    else {
      results = await db
        .collection("videos")
        .find({ "writer._id": userId })
        .toArray()
        .catch((error) => {
          return {
            success: 500,
            error: error,
          };
        });
    }
    return {
      success: 200,
      videos: results,
    };
  }

  //------------------------------------------------------------

  async function getVideoByTrend() {
    const db = await database;
    let currDate = formatDate(new Date());

    let trend = await db
      .collection("videos")
      .aggregate([
        {
          $addFields: {
            creationTime: {
              $dateFromString: {
                dateString: "$updatedAt",
              },
            },
            currentTime: {
              $dateFromString: {
                dateString: currDate,
              },
            },
          },
        },
        {
          $addFields: {
            difference: {
              $divide: [
                {
                  $subtract: ["$currentTime", "$creationTime"],
                },
                3600000,
              ],
            },
          },
        },
        {
          $addFields: {
            secs_for_one_view: {
              $trunc: {
                $multiply: [
                  {
                    $cond: [
                      { $eq: ["$views", 0] },
                      Infinity,
                      { $divide: ["$difference", "$views"] },
                    ],
                  },
                  3600,
                ],
              },
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            trend: {
              $sum: "$secs_for_one_view",
            },
          },
        },
        {
          $sort: {
            trend: 1,
          },
        },
        {
          $limit: 3,
        },
      ])
      .toArray();

    let ids = [...trend.map((id) => id._id)];
    console.log("ids: ", ids);

    const results = await db
      .collection("videos")
      .find({ _id: { $in: ids } })
      .toArray()
      .catch((error) => {
        return {
          success: 500,
          error: error,
        };
      });

    return {
      success: 200,
      videos: JSON.parse(JSON.stringify(results)),
    };
  }

  //------------------------------------------------------------

  async function findById({ videoId }) {
    console.log("videoId: ", videoId);
    const db = await database;
    const found = await db
      .collection("videos")
      .findOne({ _id: db.makeId(videoId) });

    if (found) {
      return { success: 200, video: JSON.parse(JSON.stringify(found)) };
    }
    return {
      success: 500,
      error: "failed to load video...",
    };
  }

  //------------------------------------------------------------

  async function findByTitle({ searchKey }) {
    console.log("searchKey: ", searchKey);
    const db = await database;
    const found = await db
      .collection("videos")
      .find({ title: searchKey })
      .toArray();
    if (found) {
      return { success: 200, videos: JSON.parse(JSON.stringify(found)) };
    }
    return {
      success: 500,
      error: "failed to search video...",
    };
  }

  //------------------------------------------------------------

  async function updateThumbEvents({ userId, videoId, newValue }) {
    const db = await database;
    let result;
    try {
      const video = await db
        .collection("videos")
        .findOne({ _id: db.makeId(videoId) });

      await db
        .collection("videos")
        .updateOne(
          { _id: db.makeId(videoId) },
          { $set: { likes: newValue.likes, dislikes: newValue.dislikes } }
        );

      if (video.likes !== newValue.likes) {
        console.log("Inside if block....");
        const isPresent = await db
          .collection("users")
          .findOne({ _id: db.makeId(userId), "likedVideos.likes": videoId });

        if (isPresent) {
          await db
            .collection("users")
            .updateOne(
              { _id: db.makeId(userId) },
              { $pull: { "likedVideos.likes": { $in: [videoId] } } }
            );
        } else {
          await db
            .collection("users")
            .updateOne(
              { _id: db.makeId(userId) },
              { $addToSet: { "likedVideos.likes": videoId } }
            );
        }
      }
      if (video.dislikes !== newValue.dislikes) {
        console.log("Inside if block if dislike changes....");
        const isPresent = await db
          .collection("users")
          .findOne({ _id: db.makeId(userId), "likedVideos.dislikes": videoId });

        if (isPresent) {
          await db
            .collection("users")
            .updateOne(
              { _id: db.makeId(userId) },
              { $pull: { "likedVideos.dislikes": { $in: [videoId] } } }
            );
        } else {
          await db
            .collection("users")
            .updateOne(
              { _id: db.makeId(userId) },
              { $addToSet: { "likedVideos.dislikes": videoId } }
            );
        }
      }
      result = await db.collection("users").findOne({ _id: db.makeId(userId) });
    } catch (e) {
      return {
        success: 500,
        error: "failed to update likes & dislikes..",
      };
    }
    return {
      success: 200,
      result: JSON.parse(JSON.stringify(result)),
    };
  }

  //------------------------------------------------------------

  async function updateViews({ videoId, newValue }) {
    const db = await database;
    try {
      await db
        .collection("videos")
        .updateOne({ _id: db.makeId(videoId) }, { $set: { views: newValue } });
    } catch (e) {
      return {
        success: 500,
        error: "failed to update views..",
      };
    }
    return {
      success: 200,
    };
  }

  //------------------------------------------------------------

  function documentToContact({ _id: videoId, ...doc }) {
    return makeVideo({ videoId, ...doc });
  }
}

const videoList = makeVideoList();

module.exports = videoList;
