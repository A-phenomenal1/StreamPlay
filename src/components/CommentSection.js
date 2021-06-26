import React from "react";
import { CommentTemplate, CommentField } from "./CommentTemplate";
import ReplyComment from "./ReplyComment";
import "./Comment.css";

function CommentSection(props) {
  return (
    <>
      {console.log("comment section: ", props)}
      {props.commentList &&
        props.commentList.map(
          (comment, index) =>
            comment.replyToId === null && (
              <>
                <CommentTemplate
                  comment={comment}
                  refreshCallback={props.refreshCallback}
                />
                <ReplyComment
                  commentList={props.commentList}
                  postId={props.postId}
                  refreshCallback={props.refreshCallback}
                  parentCommentId={comment._id}
                />
              </>
            )
        )}
      <CommentField
        postId={props.postId}
        refreshCallback={props.refreshCallback}
      />
    </>
  );
}

export default CommentSection;
