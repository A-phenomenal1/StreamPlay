import React, { useState } from "react";
import { Avatar, Container, Typography } from "@material-ui/core";
import { ThumbDownAlt, ThumbUpAlt } from "@material-ui/icons";
import formatTimestamp from "../config/formatTimestamp";
import dev from "../api/dev";
import "./Comment.css";

function CommentTemplate(props) {
  const [showFull, setShowFull] = useState(false);
  const [events, setEvents] = useState({
    like: false,
    dislike: false,
  });

  const onThumbEvent = (event) => {
    //will complete soon
  };

  return (
    <Container component="lg">
      <div style={{ display: "flex", margin: "0.7em 0" }}>
        {props.comment.author.profilePic === null ? (
          <Avatar
            className="avt-icon"
            style={{
              backgroundColor: props.comment.author.color,
            }}
          >
            {props.comment.author.firstName[0]}
          </Avatar>
        ) : (
          <Avatar
            src={`${dev.BaseUrl}/${props.comment.author.profilePic}`}
            className="avt-icon"
          />
        )}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography component="h2" variant="body1">
            {`${props.comment.author.firstName} ${props.comment.author.lastName}`}{" "}
            &bull;
            <span className="time-text">
              {formatTimestamp(props.comment.createdAt)}
            </span>
          </Typography>
          <Typography
            component="p"
            variant="body2"
            style={{ margin: "0.7em" }}
            className={showFull ? "" : "tooltip line-after3"}
          >
            {props.comment.text}
          </Typography>
          <div
            className="read-more-icon"
            onClick={() => setShowFull(!showFull)}
          >
            Read <span>{showFull ? "Less" : "More"}</span>
          </div>
          <div className="icons-container">
            <span
              style={{
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => onThumbEvent("like")}
            >
              <ThumbUpAlt
                className="thumb-icon"
                color={events.like ? "secondary" : "white"}
              />
              &nbsp;<span>1</span>
            </span>
            <span
              style={{ display: "flex", alignItems: "center" }}
              onClick={() => onThumbEvent("dislike")}
            >
              <ThumbDownAlt
                className="thumb-icon"
                color={events.dislike ? "secondary" : "white"}
              />
              &nbsp;<span>0</span>
            </span>
            <div className="reply-icon">Reply</div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default CommentTemplate;
