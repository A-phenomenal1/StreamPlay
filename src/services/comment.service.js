const makeComment = require("../models/comment.models");
const database = require("../db");

function makeCommentList() {
  return Object.freeze({
    add,
    getCommentByVideoId,
    updateThumbEvents,
  });

  //------------------------------------------------------------

  async function add({ commentId, ...comment }) {
    const db = await database;
    if (commentId) {
      comment._id = db.makeId(commentId);
    }

    const { result, ops } = await db
      .collection("comments")
      .insertOne(comment)
      .catch((mongoError) => {
        console.log("mongoError: ", mongoError);
        throw mongoError;
      });
    return {
      success: 201,
      result: documentToContact(ops[0]),
    };
  }

  //------------------------------------------------------------

  async function getCommentByVideoId({ videoId }) {
    const db = await database;
    const found = await db
      .collection("comments")
      .find({ postId: db.makeId(videoId).toString() })
      .toArray();
    if (found) {
      return { success: 200, comments: JSON.parse(JSON.stringify(found)) };
    }
    return {
      success: 500,
      error: "failed to load comments...",
    };
  }

  //------------------------------------------------------------

  async function updateThumbEvents({ userId, commentId, newValue }) {
    const db = await database;
    let result;
    try {
      const comment = await db
        .collection("comments")
        .findOne({ _id: db.makeId(commentId) });

      await db
        .collection("comments")
        .updateOne(
          { _id: db.makeId(commentId) },
          { $set: { likes: newValue.likes, dislikes: newValue.dislikes } }
        );

      if (comment.likes !== newValue.likes) {
        console.log("Inside if block....");
        const isPresent = await db
          .collection("users")
          .findOne({
            _id: db.makeId(userId),
            "likedComments.likes": commentId,
          });

        if (isPresent) {
          await db
            .collection("users")
            .updateOne(
              { _id: db.makeId(userId) },
              { $pull: { "likedComments.likes": { $in: [commentId] } } }
            );
        } else {
          await db
            .collection("users")
            .updateOne(
              { _id: db.makeId(userId) },
              { $addToSet: { "likedComments.likes": commentId } }
            );
        }
      }
      if (comment.dislikes !== newValue.dislikes) {
        console.log("Inside if block if dislike changes....");
        const isPresent = await db
          .collection("users")
          .findOne({
            _id: db.makeId(userId),
            "likedComments.dislikes": commentId,
          });

        if (isPresent) {
          await db
            .collection("users")
            .updateOne(
              { _id: db.makeId(userId) },
              { $pull: { "likedComments.dislikes": { $in: [commentId] } } }
            );
        } else {
          await db
            .collection("users")
            .updateOne(
              { _id: db.makeId(userId) },
              { $addToSet: { "likedComments.dislikes": commentId } }
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

  function documentToContact({ _id: commentId, ...doc }) {
    return makeComment({ commentId, ...doc });
  }
}

const commentList = makeCommentList();

module.exports = commentList;
