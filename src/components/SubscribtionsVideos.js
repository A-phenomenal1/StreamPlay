import React, { useState, useEffect } from "react";
import { Container } from "@material-ui/core";
import dev from "../api/dev";
import MediaCard from "./MediaCard";
import Loader from "./Loader";

function SubscribtionsVideos({ subscription }) {
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("subscribed in subscriptionVideos page: ", subscription);

  useEffect(() => {
    const promises = [];

    const timeOut = (subs) => {
      return new Promise((res, rej) => {
        fetch(`${dev.BaseUrl}/video/searchvideobysubs?id=${subs}`, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((data) => res(data))
          .catch((err) => rej(err));
      });
    };

    subscription.map((subs) => promises.push(timeOut(subs._id)));

    Promise.all(promises)
      .then((response) => {
        setResponse([...response]);
        setLoading(false);
        console.log("videos are :", response);
      })
      .catch((error) => console.log(`Error in executing ${error}`));
  }, [subscription]);

  return (
    <Container
      component="main"
      disableGutters={true}
      style={{ paddingLeft: 20 }}
    >
      <>
        <div className="underline2" />
        <div>
          {loading ? (
            <Loader />
          ) : response.length !== 0 ? (
            response.map((data) => {
              return (
                <>
                  <div className="vids-container1">
                    {data.videos.map((video, index) => {
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
                          width="280px"
                          height="120px"
                        />
                      );
                    })}
                  </div>
                  <div className="underline2" />
                </>
              );
            })
          ) : (
            <>
              <h4>No Videos...</h4>
            </>
          )}
        </div>
      </>
    </Container>
  );
}

export default SubscribtionsVideos;
