import { Container, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useStateValue } from "../config/StateProvider";
import NoDataPage from "../components/NoDataPage";
import MediaCard from "../components/MediaCard";
import Loader from "../components/Loader";
import dev from "../api/dev";

function LikedVideos({ should }) {
  const [{ user }, dispatch] = useStateValue();
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const promises = [];

    const timeOut = (id) => {
      return new Promise((res, rej) => {
        fetch(`${dev.BaseUrl}/video/getvideo/${id}`, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((data) => res(data))
          .catch((err) => rej(err));
      });
    };
    if (user.length !== 0 && user[0].likedVideos.likes.length !== 0)
      user[0].likedVideos.likes.map((id) => promises.push(timeOut(id)));
    else {
      setLoading(false);
    }

    Promise.all(promises)
      .then((response) => {
        setResponse([...response]);
        setLoading(false);
        console.log("videos are :", response);
      })
      .catch((error) => console.log(`Error in executing ${error}`));
  }, [user[0]]);

  return (
    <Container component="main">
      <div>
        <Typography
          component="h2"
          variant="h5"
          className="home-title"
          style={{ display: should === "none" ? "none" : null }}
        >
          Liked videos
        </Typography>
        <div
          className="underline"
          style={{ display: should === "none" ? "none" : null }}
        />
        <div style={{ marginTop: "1em" }} />
        <div
          className={should === "none" ? "vids-container1" : "vids-container2"}
        >
          {loading ? (
            <Loader />
          ) : response.length !== 0 ? (
            response.map((data, index) => {
              return (
                <MediaCard
                  key={index}
                  _id={data.video._id}
                  img={data.video.thumbnail}
                  title={data.video.title}
                  views={data.video.views}
                  duration={data.video.duration}
                  date={data.video.createdAt}
                  writer={data.video.writer}
                  width="280px"
                  height="120px"
                />
              );
            })
          ) : (
            <>
              {should === "none" ? (
                <div className="if-no-data-in-library">
                  <Typography
                    component="h2"
                    variant="h6"
                    className="home-title"
                  >
                    No videos
                  </Typography>
                </div>
              ) : (
                <NoDataPage data="Liked videos" />
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  );
}

export default LikedVideos;
