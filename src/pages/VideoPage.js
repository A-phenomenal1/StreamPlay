import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Typography,
} from "@material-ui/core";
import {
  Email,
  Facebook,
  PlaylistAdd,
  Share,
  Telegram,
  ThumbDown,
  ThumbUp,
  Twitter,
  WhatsApp,
} from "@material-ui/icons";
import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton,
  WhatsappShareButton,
  TelegramShareButton,
} from "react-share";
import { useStateValue } from "../config/StateProvider";
import formatTimestamp from "../config/formatTimestamp";
import CommentSection from "../components/CommentSection";
import VideoPlayer from "react-video-js-player";
import SideVideoPage from "./SideVideoPage";
import AlertModal from "../components/AlertModal";
import dev from "../api/dev";
import "./VideoPage.css";
import AlertBar from "../components/AlertBar";

function VideoPage() {
  const [video, setVideo] = useState();
  const [commentList, setCommentList] = useState([]);
  const [subscriberno, setSubscriberno] = useState();
  const [isSubscribed, setIsSubscribed] = useState("Subscribe");
  const [isShare, setIsShare] = useState(false);
  const [load, setLoad] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState({ isShow: false, message: [] });
  const [showBar, setShowBar] = useState({
    isShow: false,
    message: [],
    severity: "success",
  });
  const [events, setEvents] = useState({ like: false, dislike: false });
  const [isViewAdded, setIsViewAdded] = useState(false);
  const [{ user }, dispatch] = useStateValue();

  //for removing an object from array by one particular key condition
  const removeByAttr = function (arr, attr, value) {
    var i = arr.length;
    while (i--) {
      if (
        arr[i] &&
        arr[i].hasOwnProperty(attr) &&
        arguments.length > 2 &&
        arr[i][attr] === value
      )
        arr.splice(i, 1);
    }
    return arr;
  };

  const isPresentByAttr = function (arr, attr, value) {
    var i = arr.length;
    while (i--) {
      if (
        arr[i] &&
        arr[i].hasOwnProperty(attr) &&
        arguments.length > 2 &&
        arr[i][attr] === value
      ) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    let path = window.location.pathname;
    const param = path.split("/");
    fetch(`${dev.BaseUrl}/video/getvideo/${param[param.length - 1]}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("video data: ", { data });
        if (data.success) {
          setVideo(data.video);
          setLoading(false);

          user.length !== 0 &&
            setEvents({
              like: user[0].likedVideos.likes.includes(data.video._id),
              dislike: user[0].likedVideos.dislikes.includes(data.video._id),
            });

          user[0] &&
            fetch(`${dev.BaseUrl}/users/getUser/${data.video.writer._id}`, {
              method: "GET",
            })
              .then((res) => res.json())
              .then((data) => {
                try {
                  console.log("subscriber no: ", data);
                  if (data.subscribedBy.includes(user[0]._id))
                    setIsSubscribed("Subscribed");
                  setSubscriberno(data.subscribedBy.length);
                } catch (err) {
                  console.log(err);
                }
              });

          fetch(
            `${dev.BaseUrl}/comments/getcommentbyvideo?id=${data.video._id}`,
            {
              method: "GET",
            }
          )
            .then((res) => res.json())
            .then((data) => {
              console.log("data from get comment: ", data);
              setCommentList([...data.comments]);
            })
            .catch((err) => {
              console.log("error in getting comment: ", data.err, err);
            });

          // adding views and manage localhistory for recent played videos
          let id = data.video._id;
          !isViewAdded &&
            fetch(`${dev.BaseUrl}/video/updateevents?id=${data.video._id}`, {
              method: "PATCH",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                newValue: data.video.views + 1,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.success) {
                  setIsViewAdded(true);

                  let prevHistory = JSON.parse(
                    localStorage.getItem("recent-play")
                  );

                  if (prevHistory === null)
                    localStorage.setItem("recent-play", JSON.stringify([]));

                  if (!isPresentByAttr(prevHistory, "vid", id)) {
                    // console.log("not includes ", id);
                    localStorage.setItem(
                      "recent-play",
                      JSON.stringify([
                        ...new Set([
                          { date: new Date(), vid: id },
                          ...prevHistory,
                        ]),
                      ])
                    );
                  } else {
                    // console.log("includes ", id);
                    let storage = [...prevHistory];
                    removeByAttr(storage, "vid", id);
                    storage.unshift({ date: new Date(), vid: id });
                    localStorage.setItem(
                      "recent-play",
                      JSON.stringify([...new Set(storage)])
                    );
                  }
                  console.log("veiws updated");
                } else {
                  console.log("failed to update views");
                }
              })
              .catch((err) => {
                console.log(err);
              });
        } else {
          setShowModal({
            isShow: true,
            message: ["Whoops!", `${data.error}`],
          });
        }
      });
  }, [user[0], load]);

  const onSubscribe = async () => {
    if (user.length !== 0) {
      let ids = [
        {
          isPresent: false,
          param: user[0]._id,
          updateKey: "subscribedTo",
          newValue: video.writer._id,
        },
        {
          isPresent: false,
          param: video.writer._id,
          updateKey: "subscribedBy",
          newValue: user[0]._id,
        },
      ];
      if (isSubscribed === "Subscribed") {
        ids[0].isPresent = true;
        ids[1].isPresent = true;
      }
      for (let i = 0; i < 2; i++) {
        const { isPresent, param, updateKey, newValue } = ids[i];
        await fetch(`${dev.BaseUrl}/users/updatesubscriber?id=${param}`, {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            isPresent: isPresent,
            updateKey: updateKey,
            newValue: newValue,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log({ data });
            try {
              if (data.success) {
                if (updateKey === "subscribedBy") {
                  if (isSubscribed === "Subscribed") {
                    setShowModal({
                      isShow: true,
                      message: [
                        "I'm sorry to hear",
                        `You have unsubscribed ${video.writer.firstName} ${video.writer.lastName}`,
                      ],
                    });
                    setIsSubscribed("Subscribe");
                  } else {
                    setShowModal({
                      isShow: true,
                      message: [
                        "Bravo!",
                        `You Subscribed ${video.writer.firstName} ${video.writer.lastName}`,
                      ],
                    });
                    setIsSubscribed("Subscribed");
                  }
                  setLoad(!load);
                } else {
                  dispatch({
                    type: "SET_USER",
                    user: [data.result],
                  });
                }
              } else {
                setShowModal({
                  isShow: true,
                  message: ["Whoops!", `Failed to update subscribe`],
                });
              }
            } catch (err) {
              console.log(err);
            }
          });
      }
    } else
      setShowModal({
        isShow: true,
        message: ["Whoops!", `You should login first.`],
      });
  };

  const onThumbEvent = async (event) => {
    let newValue = {
      likes: events.like
        ? video.likes - 1
        : event === "like"
        ? video.likes + 1
        : video.likes,
      dislikes: events.dislike
        ? video.dislikes - 1
        : event === "dislike"
        ? video.dislikes + 1
        : video.dislikes,
    };
    user.length !== 0
      ? await fetch(
          `${dev.BaseUrl}/video/updateevents?id=${video._id}&userId=${user[0]._id}`,
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
            if (data.success) {
              setEvents({
                like:
                  event === "like" || events.like ? !events.like : events.like,
                dislike:
                  event === "dislike" || events.dislike
                    ? !events.dislike
                    : events.dislike,
              });
              if (event === "like")
                setShowBar({
                  isShow: true,
                  message: !events.like
                    ? [`Added to Liked videos`]
                    : [`Removed from Liked videos`],
                  severity: "success",
                });
              dispatch({
                type: "SET_USER",
                user: [data.result],
              });
              setLoad(!load);
            } else {
              setShowBar({
                isShow: true,
                message: [`Failed to update like and dislike`],
                severity: "error",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          })
      : setShowModal({
          isShow: true,
          message: ["Whoops!", `You should Login first...`],
        });
  };

  const updateComment = (newComment) => {
    console.log("main comments array updated. with ", newComment);
    setCommentList((prevComment) => [...prevComment, newComment]);
  };

  const shareModal = () => {
    return (
      <>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <FacebookShareButton
            url={`${window.location.href}`}
            quote="Check out this video on StreamPlay website. Link:  "
          >
            <Button style={{ width: 35 }}>
              <Facebook style={{ color: "#0052ff", fontSize: "35px" }} />
            </Button>
          </FacebookShareButton>

          <WhatsappShareButton
            url={`${window.location.href}`}
            title="Check out this video on StreamPlay website. Link: \n "
          >
            <Button style={{ width: 35 }}>
              <WhatsApp style={{ color: "#00ff5e", fontSize: "35px" }} />
            </Button>
          </WhatsappShareButton>

          <TelegramShareButton
            url={`${window.location.href}`}
            title="Check out this video on StreamPlay website. Link: \n "
          >
            <Button style={{ width: 35 }}>
              <Telegram style={{ color: "#00b1ff", fontSize: "35px" }} />
            </Button>
          </TelegramShareButton>

          <TwitterShareButton
            url={`${window.location.href}`}
            title="Check out this video on StreamPlay website. Link: \n "
          >
            <Button style={{ width: 35 }}>
              <Twitter style={{ color: "#00b6ff", fontSize: "35px" }} />
            </Button>
          </TwitterShareButton>

          <EmailShareButton
            subject={`Check out This video`}
            body={`Check out this of StreamPlay website. Link:  
         ${window.location.pathname}  `}
          >
            <Button style={{ width: 35 }}>
              <Email style={{ color: "#f53c3c", fontSize: "35px" }} />
            </Button>
          </EmailShareButton>
        </div>
      </>
    );
  };

  return (
    <Container component="main">
      {showModal.isShow ? (
        <AlertModal
          hideModal={() => setShowModal((prev) => ({ ...prev, isShow: false }))}
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
      {isShare ? (
        <AlertModal
          hideModal={() => setIsShare(false)}
          message={["Share this video on:"]}
          children={shareModal()}
        />
      ) : null}
      <CssBaseline />
      <div className="page-cont">
        <Grid item lg={8} md={12}>
          <div className="player-container">
            {loading ? (
              <div className="video-player-temp" />
            ) : (
              <VideoPlayer
                preload
                autoplay={true}
                controls={true}
                src={`${video.filePath}`}
                poster={`${video.thumbnail}`}
                className="video-player"
              />
            )}
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ padding: 10 }}>
              <Typography
                variant="h6"
                component="h3"
                className="tooltip line-after1"
              >
                {video && video.title}
              </Typography>
              <div className="video-title2">
                <Typography
                  variant="body1"
                  component="h2"
                  color="textSecondary"
                >
                  {video && video.views} views &bull;{" "}
                  {video && formatTimestamp(video.createdAt)}
                </Typography>
                <Box style={{ flexGrow: 0.9 }} />
                <div className="video-icons-cont">
                  <span
                    style={{ display: "flex", margin: "0 10px" }}
                    onClick={() => onThumbEvent("like")}
                  >
                    <ThumbUp
                      color={events.like ? "secondary" : "white"}
                      style={{ cursor: "pointer" }}
                    />
                    &nbsp;<span>{video && video.likes}</span>
                  </span>
                  <span
                    style={{ display: "flex", margin: "0 10px" }}
                    onClick={() => onThumbEvent("dislike")}
                  >
                    <ThumbDown
                      color={events.dislike ? "secondary" : "white"}
                      style={{ cursor: "pointer" }}
                    />
                    &nbsp;<span>{video && video.dislikes}</span>
                  </span>
                  <span className="share" onClick={() => setIsShare(true)}>
                    <Share />
                    &nbsp;<span>Share</span>
                  </span>
                  <span className="save">
                    <PlaylistAdd />
                    &nbsp;<span>Save</span>
                  </span>
                </div>
              </div>
              <hr />
            </div>
            <div style={{ display: "flex" }}>
              <div className="video-detail-box">
                <div style={{ display: "flex", alignItems: "center" }}>
                  {video && video.writer.profilePic === null ? (
                    <Avatar
                      className="avt-sz"
                      style={{
                        backgroundColor: video && video.writer.color,
                      }}
                    >
                      {video && video.writer.firstName[0]}
                    </Avatar>
                  ) : (
                    <Avatar
                      src={video && `${video.writer.profilePic}`}
                      className="avt-sz"
                    />
                  )}
                  <Typography
                    variant="body1"
                    component="h2"
                    className="writer-info"
                  >
                    <span className="tooltip line-after1">
                      {video && video.writer.firstName}{" "}
                      {video && video.writer.lastName}
                    </span>
                    <span style={{ fontSize: "12px", color: "#d1d1d1" }}>
                      {subscriberno} Subscribers
                    </span>
                  </Typography>
                </div>
              </div>
              <Box style={{ flexGrow: 0.8 }} />
              <Button
                variant="contained"
                color="secondary"
                size={"medium"}
                style={{ height: "40px" }}
                onClick={onSubscribe}
              >
                {isSubscribed}
              </Button>
            </div>
            <Typography
              variant="body1"
              color="textSecondary"
              component="p"
              style={{ padding: "0 20px 0 70px " }}
              className={showFull ? "" : "tooltip line-after3"}
            >
              {video && video.description}
            </Typography>
            <div
              className="read-more-icon"
              style={{ marginLeft: "70px" }}
              onClick={() => setShowFull(!showFull)}
            >
              Read <span>{showFull ? "Less" : "More"}</span>
            </div>
            <div className="underline" />
            <Typography
              component="h2"
              variant="h5"
              style={{ marginTop: "1em" }}
            >
              Comments:
            </Typography>
            <CommentSection
              commentList={commentList}
              postId={video && video._id}
              refreshCallback={updateComment}
            />
          </div>
        </Grid>
        <Grid item lg={4} md={8} sm={12}>
          <SideVideoPage />
        </Grid>
      </div>
    </Container>
  );
}

export default VideoPage;
