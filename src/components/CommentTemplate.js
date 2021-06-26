import React, { useState, useEffect } from "react";
import {
  Avatar,
  Container,
  Typography,
  Button,
  TextField,
} from "@material-ui/core";
import { ThumbDownAlt, ThumbUpAlt } from "@material-ui/icons";
import { useStateValue } from "../config/StateProvider";
import formatTimestamp from "../config/formatTimestamp";
import AlertModal from "./AlertModal";
import AlertBar from "./AlertBar";
import dev from "../api/dev";
import "./Comment.css";

export function CommentTemplate(props) {
  const [{ user }, dispatch] = useStateValue();
  const [showFull, setShowFull] = useState(false);
  const [openReply, setOpenReply] = useState(false);
  const [load, setLoad] = useState(false);
  const [showModal, setShowModal] = useState({ isShow: false, message: [] });
  const [events, setEvents] = useState({
    like: false,
    dislike: false,
  });
  props.comment.replyToId !== null &&
    console.log("props in commentTemplate: ", props);

  const onThumbEvent = async (event) => {
    let newValue = {
      likes: events.like
        ? props.comment.likes - 1
        : event === "like"
        ? props.comment.likes + 1
        : props.comment.likes,
      dislikes: events.dislike
        ? props.comment.dislikes - 1
        : event === "dislike"
        ? props.comment.dislikes + 1
        : props.comment.dislikes,
    };
    user.length !== 0
      ? await fetch(
          `${dev.BaseUrl}/comments/updateevents?id=${props.comment._id}&userId=${user[0]._id}`,
          {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              newValue,
            }),
          }
        )
          .then((res) => res.json())
          .then((data) => {
            console.log({ data });
            try {
              if (data.success) {
                setEvents({
                  like:
                    event === "like" || events.like
                      ? !events.like
                      : events.like,
                  dislike:
                    event === "dislike" || events.dislike
                      ? !events.dislike
                      : events.dislike,
                });
                dispatch({
                  type: "SET_USER",
                  user: [data.result],
                });
                setLoad(!load);
              } else {
                setShowModal({
                  isShow: true,
                  message: ["Whoops!", `Failed to change like and dislike.`],
                });
              }
            } catch (err) {
              console.log(err);
            }
          })
      : setShowModal({
          isShow: true,
          message: ["Whoops!", `You should login first.`],
        });
  };

  useEffect(() => {
    if (user.length !== 0) {
      if (user[0].likedComments.likes.includes(props.comment._id))
        setEvents((prev) => ({ ...prev, like: true }));
      if (user[0].likedComments.dislikes.includes(props.comment._id))
        setEvents((prev) => ({ ...prev, dislike: true }));
    }
  }, []);

  return (
    <Container component="lg">
      {showModal.isShow ? (
        <AlertModal
          hideModal={() => setShowModal((prev) => ({ ...prev, isShow: false }))}
          message={showModal.message}
        />
      ) : null}
      <div
        style={{
          display: "flex",
          margin: "0.7em 0",
        }}
      >
        {props.comment.writer.profilePic === null ? (
          <Avatar
            className="avt-icon"
            style={{
              backgroundColor: props.comment.writer.color,
            }}
          >
            {props.comment.writer.firstName[0]}
          </Avatar>
        ) : (
          <Avatar
            src={`${props.comment.writer.profilePic}`}
            className="avt-icon"
          />
        )}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography component="h2" variant="body1">
            {`${props.comment.writer.firstName} ${props.comment.writer.lastName}`}{" "}
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
              &nbsp;<span>{props.comment.likes}</span>
            </span>
            <span
              style={{ display: "flex", alignItems: "center" }}
              onClick={() => onThumbEvent("dislike")}
            >
              <ThumbDownAlt
                className="thumb-icon"
                color={events.dislike ? "secondary" : "white"}
              />
              &nbsp;<span>{props.comment.dislikes}</span>
            </span>
            <div className="reply-icon" onClick={() => setOpenReply(true)}>
              Reply
            </div>
          </div>
        </div>
      </div>
      {openReply ? (
        <>
          {console.log("openReply, commentID:  ", openReply, props.comment._id)}
          <CommentField
            for="reply"
            callback={() => setOpenReply(false)}
            commentId={
              props.comment._id === undefined
                ? props.comment.commentId
                : props.comment._id
            }
            postId={props.comment.postId}
            refreshCallback={props.refreshCallback}
          />
        </>
      ) : null}
    </Container>
  );
}

export function CommentField(props) {
  const [showBtn, setShowBtn] = useState(false);
  const [comment, setComment] = useState("");
  const [showModal, setShowModal] = useState({ isShow: false, message: [] });
  const [showBar, setShowBar] = useState({
    isShow: false,
    message: [],
    severity: "success",
  });
  const [{ user }, dispatch] = useStateValue();
  console.log("props in commentField: ", props);

  const handleComment = (commentId = null) => {
    console.log("commentId :", commentId);
    if (user.length === 0)
      setShowModal({
        isShow: true,
        message: ["Whoops!", `You should Login first...`],
      });
    else {
      const variables = {
        text: comment,
        writer: {
          _id: user[0]._id,
          color: user[0].color,
          firstName: user[0].firstName,
          lastName: user[0].lastName,
          profilePic: user[0].profilePic,
          coverPic: user[0].coverPic,
        },
        postId: props.postId,
        replyToId: commentId,
        likes: 0,
        dislikes: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      console.log("variables: ", variables);
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
            setShowBar({
              isShow: true,
              message: [`Your comment will be added soon.`],
              severity: "success",
            });
            props.refreshCallback(data.result);
            if (commentId !== null) {
              props.callback();
            }
          } else {
            console.log("error on comment save: ");
          }
        });
    }
  };

  return (
    <>
      <Container component="lg">
        {showModal.isShow ? (
          <AlertModal
            hideModal={() =>
              setShowModal((prev) => ({ ...prev, isShow: false }))
            }
            message={showModal.message}
          />
        ) : null}
        {showBar.isShow ? (
          <AlertBar
            hideBar={() => setShowBar((prev) => ({ ...prev, isShow: false }))}
            message={showBar.message}
            type={showBar.severity}
          />
        ) : null}
        <div
          style={{
            display: "flex",
            margin: "0.7em 0",
          }}
        >
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
              src={user.length !== 0 && `${user[0].profilePic}`}
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
              onClick={() => handleComment(props.commentId)}
            >
              Comment
            </Button>
          </div>
        ) : null}
      </Container>
    </>
  );
}
