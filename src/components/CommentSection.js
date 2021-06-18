import React, { useState } from "react";
import { Avatar, Button, Container, TextField } from "@material-ui/core";
import { useStateValue } from "../config/StateProvider";
import CommentTemplate from "./CommentTemplate";
import dev from "../api/dev";
import "./Comment.css";

function CommentSection(props) {
  const [showBtn, setShowBtn] = useState(false);
  const [comment, setComment] = useState("");
  const [{ user }, dispatch] = useStateValue();

  const handleComment = () => {
    if (user.length === 0) alert("You should login first...");
    else {
      const variables = {
        text: comment,
        author: {
          _id: user[0]._id,
          color: user[0].color,
          firstName: user[0].firstName,
          lastName: user[0].lastName,
          profilePic: user[0].profilePic,
          coverPic: user[0].coverPic,
        },
        postId: props.postId,
        replyToId: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      fetch(`${dev.BaseUrl}/comments/savecomment`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ ...variables }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setComment("");
            props.refreshCallback(data.result);
          } else {
            console.log("error on comment save: ");
          }
        });
    }
  };
  return (
    <>
      {props.commentList &&
        props.commentList.map((comment, index) => (
          <CommentTemplate comment={comment} />
        ))}
      <Container component="lg">
        <div style={{ display: "flex", margin: "0.7em 0" }}>
          {user.length !== 0 && user[0].profilePic === null ? (
            <Avatar
              style={{
                backgroundColor: user[0].color,
              }}
              className="avt-icon"
            >
              {user[0].firstName[0]}
            </Avatar>
          ) : (
            <Avatar
              src={user.length !== 0 && `${dev.BaseUrl}/${user[0].profilePic}`}
              className="avt-icon"
            />
          )}
          <TextField
            variant="standard"
            fullWidth
            id="comment"
            placeholder="Add a public comment"
            name="comment"
            value={comment}
            autoComplete="comment"
            multiline
            rows={3}
            onFocus={() => setShowBtn(true)}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        {showBtn ? (
          <div className="hide-btn-cont">
            {props.for && (
              <>
                <Button variant="text" onClick={props.callback}>
                  Cancel
                </Button>
                <span style={{ margin: "0 1em" }} />
              </>
            )}
            <Button
              variant="contained"
              style={{ backgroundColor: "#FFC074" }}
              onClick={handleComment}
            >
              Comment
            </Button>
          </div>
        ) : null}
      </Container>
    </>
  );
}

export default CommentSection;
