import React, { useState, useEffect } from "react";
import { Container } from "@material-ui/core";
import { CommentTemplate } from "./CommentTemplate";

function ReplyComment(props) {
  const [childCount, setChildCount] = useState(0);
  const [showReplies, setShowReplies] = useState(false);
  const [load, setLoad] = useState(false);
  // console.log("props in ReplyComment: ", props);

  useEffect(() => {
    let commentNumber = 0;
    props.commentList.map((comment) => {
      if (comment.replyToId === props.parentCommentId) {
        commentNumber++;
        // window.location.reload(false);
      }
    });
    setChildCount(commentNumber);
  }, []);

  useEffect(() => {
    setLoad(!load);
  }, [childCount]);

  return (
    <Container component="lg">
      {childCount > 0 ? (
        <p
          style={{
            fontSize: "14px",
            color: "lightgray",
            marginLeft: "60px",
            cursor: "pointer",
          }}
          onClick={() => setShowReplies(!showReplies)}
        >
          View {childCount} more comment(s)
        </p>
      ) : null}
      {showReplies ? (
        <div>
          {props.commentList &&
            props.commentList.map((comment, index) => (
              <React.Fragment>
                {comment.replyToId === props.parentCommentId && (
                  <div style={{ marginLeft: "25px", width: "100%" }}>
                    {console.log("in reply comment: ", comment)}
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
                  </div>
                )}
              </React.Fragment>
            ))}
        </div>
      ) : null}
    </Container>
  );
}

export default ReplyComment;
