const makeComment = require("../models/comment.models");
const database = require("../db");
const formatDate = require("../helpers/format-date");

function makeCommentList() {
  return Object.freeze({
    add,
    getCommentByVideoId,
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

  function documentToContact({ _id: commentId, ...doc }) {
    return makeComment({ commentId, ...doc });
  }
}

const commentList = makeCommentList();

module.exports = commentList;
