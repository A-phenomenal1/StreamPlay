import React, { useState } from "react";
import { Avatar, Container, Typography } from "@material-ui/core";
import { History as Recent, Favorite, OndemandVideo } from "@material-ui/icons";
import { useStateValue } from "../config/StateProvider";
import HistoryPage from "./HistoryPage";
import "./LibraryPage.css";
import LikedVideos from "./LikedVideos";
import MyVideos from "./MyVideos";

function LibraryPage() {
  const [{ user }, dispatch] = useStateValue();
  const [count, setCount] = useState(0);

  return (
    <Container component="main">
      <div className="user-cont">
        <Avatar
          style={{
            width: 80,
            height: 80,
            backgroundColor: user.length !== 0 ? user[0].color : "#47597e",
            fontSize: "1.5em",
          }}
        >
          {user.length !== 0 ? user[0].firstName[0] : null}
        </Avatar>
        <Typography
          component="h2"
          variant="h6"
          style={{ color: "#fff", marginTop: "6px" }}
        >
          {user.length !== 0
            ? `${user[0].firstName} ${user[0].lastName}`
            : null}
        </Typography>
        <div className="underline2" />
        <div className="block">
          <span>Subscriptions</span>
          <span>{user.length !== 0 ? user[0].subscribedTo.length : 0}</span>
        </div>
        <div className="underline2" />
        <div className="block">
          <span>Subscribers</span>
          <span>{user.length !== 0 ? user[0].subscribedBy.length : 0}</span>
        </div>
        <div className="underline2" />
        <div className="block">
          <span>Uploads</span>
          <span>{count}</span>
        </div>
        <div className="underline2" />
        <div className="block">
          <span>Liked Videos</span>
          <span>
            {user.length !== 0 ? user[0].likedVideos.likes.length : 0}
          </span>
        </div>
        <div className="underline2" />
      </div>
      <div className="underline" />
      <div>
        <div className="subtitle-title">
          <Recent />
          <span style={{ marginLeft: 10 }} />
          <Typography component="h2" variant="subtitle1">
            History
          </Typography>
        </div>
        <HistoryPage should="none" />
      </div>
      <div className="underline" />
      <div>
        <div className="subtitle-title">
          <Favorite />
          <span style={{ marginLeft: 10 }} />
          <Typography component="h2" variant="subtitle1">
            Liked Videos
          </Typography>
        </div>
        <LikedVideos should="none" />
      </div>
      <div className="underline" />
      <div>
        <div className="subtitle-title">
          <OndemandVideo />
          <span style={{ marginLeft: 10 }} />
          <Typography component="h2" variant="subtitle1">
            My Videos
          </Typography>
        </div>
        <MyVideos should="none" callback={(count) => setCount(count)} />
      </div>
    </Container>
  );
}

export default LibraryPage;
