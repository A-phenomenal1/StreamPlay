import React, { useState, useEffect } from "react";
import { Container, Typography } from "@material-ui/core";
import MediaCard from "../components/MediaCard";
import Trending from "../components/Trending";
import dev from "../api/dev";
import "./Home.css";
import Loader from "../components/Loader";

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${dev.BaseUrl}/video/getallvideo?page=1&limit=6`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log({ data });
        if (data.success) {
          setVideos(data.videos);
          setLoading(false);
        } else {
          console.log(data.error);
        }
      });
  }, []);

  return (
    <>
      <Container component="main">
        <div>
          <Typography component="h2" variant="h5" className="home-title">
            Recommended
          </Typography>
          <div className="underline" />
          <div style={{ marginTop: "1em" }} />
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="vids-container2">
                {videos.results.map((video, index) => {
                  return (
                    <MediaCard
                      key={index}
                      _id={video._id}
                      img={video.thumbnail}
                      title={video.title}
                      views={video.views}
                      duration={video.duration}
                      date={video.createdAt}
                      writer={video.writer}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </Container>
      {videos.length !== 0 ? <Trending /> : null}
    </>
  );
}

export default Home;
