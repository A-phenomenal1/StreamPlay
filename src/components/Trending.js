import React, { useState, useEffect } from "react";
import { Container, Typography } from "@material-ui/core";
import MediaCard from "./MediaCard";
import dev from "../api/dev";
import "../pages/Home.css";
import Loader from "./Loader";

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${dev.BaseUrl}/video/gettrendvideos`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log({ data });
        if (data.success) {
          setVideos(data.videos);
          setLoading(false);
        } else {
          alert(data.error);
        }
      });
  }, []);

  return (
    <Container component="main">
      <div>
        <Typography component="h2" variant="h5" className="home-title">
          Trending
        </Typography>
        <div className="underline" />
        <div style={{ marginTop: "1em" }} />
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="vids-container">
              {videos.length !== 0 ? (
                videos.map((video, index) => {
                  return (
                    <MediaCard
                      key={index}
                      at={index + 1}
                      _id={video._id}
                      img={video.thumbnail}
                      title={video.title}
                      views={video.views}
                      duration={video.duration}
                      date={video.createdAt}
                      writer={video.writer}
                      page="true"
                    />
                  );
                })
              ) : (
                <div className="if-no-data-in-library">
                  <Typography
                    component="h2"
                    variant="h6"
                    className="home-title"
                  >
                    No Trending videos
                  </Typography>
                </div>
              )}
            </div>
            {/* <div style={{ marginTop: "1em" }} /> */}
          </>
        )}
      </div>
    </Container>
  );
}

export default Home;
