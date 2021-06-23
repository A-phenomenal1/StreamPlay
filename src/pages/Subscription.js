import React, { useState, useEffect } from "react";
import { Avatar, Container, Typography } from "@material-ui/core";
import { useStateValue } from "../config/StateProvider";
import SubscriptionsVideos from "../components/SubscribtionsVideos";
import NoDataPage from "../components/NoDataPage";
import Loader from "../components/Loader";
import dev from "../api/dev";
import "./Home.css";

function Subscription() {
  const [subscribed, setSubscribed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    const promises = [];

    const timeOut = (subs) => {
      return new Promise((res, rej) => {
        fetch(`${dev.BaseUrl}/users/getUser/${subs}`, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((data) => res(data))
          .catch((err) => rej(err));
      });
    };

    user.length !== 0 &&
      user[0].subscribedTo.map((subs) => promises.push(timeOut(subs)));

    Promise.all(promises)
      .then((response) => {
        setSubscribed([...response]);
        setLoading(false);
      })
      .catch((error) => console.log(`Error in executing ${error}`));
  }, [user[0]]);

  return (
    <Container component="main">
      <div>
        <Typography component="h2" variant="h5" className="home-title">
          My Subscriptions
        </Typography>
        <div className="underline" />
        <div style={{ marginTop: "1em" }} />
        {loading ? (
          <Loader />
        ) : subscribed.length !== 0 ? (
          <>
            <div className="vids-container1">
              {subscribed.map((subscribe) => {
                return (
                  <div className="avt-cont">
                    {subscribe.profilePic === null ? (
                      <Avatar
                        style={{
                          width: 60,
                          height: 60,
                          backgroundColor: subscribe.color,
                          fontSize: "1.5em",
                        }}
                      >
                        {subscribe.firstName[0]}
                      </Avatar>
                    ) : (
                      <Avatar
                        src={`${subscribe.profilePic}`}
                        style={{
                          width: 60,
                          height: 60,
                        }}
                      />
                    )}
                    <Typography
                      component="h2"
                      variant="subtitle2"
                      style={{ color: "#fff" }}
                    >
                      {subscribe.firstName}&nbsp;{subscribe.lastName}
                    </Typography>
                  </div>
                );
              })}
            </div>
            <div style={{ marginLeft: -25 }}>
              <SubscriptionsVideos subscription={subscribed} />
            </div>
          </>
        ) : (
          <>
            <NoDataPage data="Subscriptions" />
          </>
        )}
      </div>
    </Container>
  );
}

export default Subscription;
