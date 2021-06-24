import React, { useState, useEffect } from "react";
import { Container, Typography } from "@material-ui/core";
import MediaCard from "../components/MediaCard";
import Trending from "../components/Trending";
import Loader from "../components/Loader";
import dev from "../api/dev";
import "./Home.css";

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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
          setLoading(false);
          alert("Something wrong occured!!!");
        }
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    console.log("filter: ", filter);
    if (filter === "all") {
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
            setLoading(false);
            alert("Something wrong occured!!!");
          }
        });
    } else {
      fetch(
        `${dev.BaseUrl}/video/getfiltervideos?filter=${filter}&page=1&limit=6`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("filter", data);
          if (data.success) {
            setVideos(data.videos);
            setLoading(false);
          } else {
            console.log(data.error);
            setLoading(false);
            alert("Something wrong occured!!!");
          }
        });
    }
  }, [filter]);

  return (
    <>
      <Container component="main">
        <div>
          <Typography component="h2" variant="h5" className="home-title">
            Recommended
          </Typography>
          <div className="underline" />
          <div style={{ marginTop: "1em" }} />
          <div className="filterbtn-cont">
            <div
              className={filter === "all" ? "filterbtn active" : "filterbtn"}
              onClick={() => setFilter("all")}
            >
              All
            </div>
            <div
              className={
                filter === "Education" ? "filterbtn active" : "filterbtn"
              }
              onClick={() => setFilter("Education")}
            >
              Education
            </div>
            <div
              className={filter === "Movies" ? "filterbtn active" : "filterbtn"}
              onClick={() => setFilter("Movies")}
            >
              Movies
            </div>
            <div
              className={filter === "Music" ? "filterbtn active" : "filterbtn"}
              onClick={() => setFilter("Music")}
            >
              Music
            </div>
            <div
              className={filter === "Sports" ? "filterbtn active" : "filterbtn"}
              onClick={() => setFilter("Sports")}
            >
              Sports
            </div>
            <div
              className={filter === "Kids" ? "filterbtn active" : "filterbtn"}
              onClick={() => setFilter("Kids")}
            >
              Kids
            </div>
          </div>
          {loading ? (
            <Loader />
          ) : videos.results.length !== 0 ? (
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
          ) : (
            <div
              className="if-no-data-in-library"
              style={{ alignItems: "center" }}
            >
              <Typography component="h2" variant="h6" className="home-title">
                No videos
              </Typography>
            </div>
          )}
        </div>
      </Container>
      {videos.length !== 0 ? <Trending /> : null}
    </>
  );
}

export default Home;
