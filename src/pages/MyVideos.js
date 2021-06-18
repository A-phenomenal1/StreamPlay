import { Container, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useStateValue } from "../config/StateProvider";
import NoDataPage from "../components/NoDataPage";
import MediaCard from "../components/MediaCard";
import Loader from "../components/Loader";
import dev from "../api/dev";

function MyVideos({ should, callback }) {
  const [{ user }, dispatch] = useStateValue();
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let data = localStorage.getItem("JwtAuthToken");
    fetch(`${dev.BaseUrl}/authusers/getallvideo`, {
      method: "GET",
      headers: {
        "auth-token": data,
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setResponse([...data.videos]);
        if (should === "none") callback(data.videos.length);
        console.log("user's videos: ", data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
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
          My videos
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
                  _id={data._id}
                  img={data.thumbnail}
                  title={data.title}
                  views={data.views}
                  duration={data.duration}
                  date={data.createdAt}
                  writer={data.writer}
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
                <NoDataPage data="Uploaded Videos" />
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  );
}

export default MyVideos;
