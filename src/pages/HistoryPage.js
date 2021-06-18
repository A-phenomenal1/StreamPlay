import { Container, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import dev from "../api/dev";
import Loader from "../components/Loader";
import MediaCard from "../components/MediaCard";
import NoDataPage from "../components/NoDataPage";

function HistoryPage({ should }) {
  const [response, setResponse] = useState([]);
  const [filter, setFilter] = useState("all");
  const [filterHistory, setFilterHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const diffDate = (obj) => {
    let todayDate = new Date();
    let hisDate = new Date(obj.date);
    let diffTime = Math.abs(todayDate - hisDate);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  //for finding an object from array by one particular key condition
  const filterByAttr = (arr, days) => {
    let required = [];
    var i = arr.length;
    while (i--) {
      let days1 = diffDate(arr[i]);
      // console.log("in filterByAttr: ", days1, days, arr[i]);
      if (days1 === days + 1) {
        required.push(arr[i]);
      }
    }
    return required;
  };

  useEffect(() => {
    let history = JSON.parse(localStorage.getItem("recent-play"));
    let arr;
    if (filter === "today") {
      arr = filterByAttr(history, 0);
    } else if (filter === "yesterday") {
      arr = filterByAttr(history, 1);
    } else if (filter === "2 days before") {
      arr = filterByAttr(history, 2);
    } else {
      arr = history;
    }
    setFilterHistory([...arr]);
  }, [filter]);

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
    if (filterHistory.length !== 0)
      filterHistory.map((id) => promises.push(timeOut(id.vid)));
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
  }, [filterHistory]);

  return (
    <Container component="main">
      <div>
        <Typography
          component="h2"
          variant="h5"
          className="home-title"
          style={{ display: should === "none" ? "none" : null }}
        >
          My History
        </Typography>
        <div
          className="underline"
          style={{ display: should === "none" ? "none" : null }}
        />
        <div style={{ marginTop: "1em" }} />
        <div
          style={{
            display: should === "none" ? "none" : "flex",
            width: "100%",
            overflow: "auto hidden",
          }}
        >
          <div
            className={filter === "today" ? "filterbtn active" : "filterbtn"}
            onClick={() => setFilter("today")}
          >
            Today
          </div>
          <div
            className={
              filter === "yesterday" ? "filterbtn active" : "filterbtn"
            }
            onClick={() => setFilter("yesterday")}
          >
            Yesterday
          </div>
          <div
            className={
              filter === "2 days before" ? "filterbtn active" : "filterbtn"
            }
            onClick={() => setFilter("2 days before")}
          >
            2 Days Before
          </div>
          <div
            className={filter === "all" ? "filterbtn active" : "filterbtn"}
            onClick={() => setFilter("all")}
          >
            All
          </div>
        </div>
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
                <NoDataPage data="History" page="history" />
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  );
}

export default HistoryPage;
