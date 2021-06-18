import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import SideMediacard from "../components/SideMediaCard";
import dev from "../api/dev";
import "./VideoPage.css";

function SideVideoPage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch(`${dev.BaseUrl}/video/getallvideo?page=1&limit=10`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        console.log({ data });
        if (data.success) setVideos(data.videos);
        else {
          alert(data.error);
        }
      });
  }, []);

  return (
    <div className="side-cont">
      <Typography
        gutterBottom
        variant="h5"
        component="h2"
        className="side-header"
      >
        More Videos
      </Typography>
      <hr />
      <div style={{ padding: "0 15px" }}>
        {videos.length !== 0 &&
          videos.results.map((video, index) => {
            return (
              <SideMediacard
                key={index}
                _id={video._id}
                img={video.thumbnail}
                title={video.title}
                views={video.views}
                category={video.category}
                duration={video.duration}
                date={video.createdAt}
                writer={video.writer}
              />
            );
          })}
      </div>
    </div>
  );
}

export default SideVideoPage;
