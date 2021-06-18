import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
} from "@material-ui/core";
import {
  Home,
  Subscriptions,
  VideoLibrary,
  History as Recent,
  Favorite,
  OndemandVideo,
  Settings,
  Help,
  Info,
  ContactSupport,
  Lock,
} from "@material-ui/icons";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useStateValue } from "../config/StateProvider";
import logo from "../assets/icons/streamplay3.png";
import "./Sidepanel.css";

const useStyles = makeStyles(() => ({
  drawerPaper: {
    width: 230,
    top: 60,
    height: "calc(100% - 60px)",
    overflowX: "hidden",
  },

  drawerPaper_Mobile: {
    width: 256,
  },

  listItem: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
  },

  listBtn: {
    fontWeight: 600,
    justifyContent: "flex-start",
    textTransform: "none",
    width: "100%",
    paddingLeft: 30,
    "&:hover": {
      backgroundColor: "#52616b",
    },
  },
}));

function Sidepanel({ onMobileClose, openMobile, shouldDisplay }) {
  const [{ user }, dispatch] = useStateValue();
  const classes = useStyles();
  const history = useHistory();

  const items1 = [
    {
      icon: Home,
      title: "Home",
      path: "/home",
    },
    {
      icon: Subscriptions,
      title: "Subscriptions",
      path: "/subscriptions",
    },
  ];

  const items2 = [
    {
      icon: VideoLibrary,
      title: "Library",
      path: "/library",
    },
    {
      icon: Recent,
      title: "History",
      path: "/history",
    },
    {
      icon: Favorite,
      title: "Liked Videos",
      path: "/likedvideos",
    },
    {
      icon: OndemandVideo,
      title: "My Videos",
      path: "/myvideos",
    },
  ];

  const items3 = [
    {
      icon: Settings,
      title: "Settings",
      path: "/settings",
    },
    {
      icon: Help,
      title: "Help",
      path: "/help",
    },
    {
      icon: Info,
      title: "About us",
      path: "/aboutus",
    },
    {
      icon: ContactSupport,
      title: "Contact us",
      path: "/contactus",
    },
  ];

  const handleProfile = async () => {
    if (user[0] && user[0].length !== 0) {
      localStorage.removeItem("recent-play");
      localStorage.removeItem("JwtAuthToken");
      await dispatch({
        type: "SET_USER",
        user: [],
      });
      console.log("Handle Logout Function Called...");
      history.push("/");
    } else {
      history.push("/signin");
    }
  };

  const content = (
    <>
      <Box style={{ paddingBottom: 60 }}>
        <List>
          <List>
            {items1.map((item) => (
              <ListItem disableGutters className={classes.listItem}>
                <Button
                  className={classes.listBtn}
                  onClick={() => history.push(item.path)}
                >
                  {item.icon && (
                    <item.icon style={{ marginRight: 10, width: 25 }} />
                  )}
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 500,
                    }}
                  >
                    {item.title}
                  </span>
                </Button>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {items2.map((item) => (
              <ListItem disableGutters className={classes.listItem}>
                <Button
                  className={classes.listBtn}
                  onClick={() => history.push(item.path)}
                >
                  {item.icon && (
                    <item.icon style={{ marginRight: 10, width: 20 }} />
                  )}
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 500,
                    }}
                  >
                    {item.title}
                  </span>
                </Button>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {items3.map((item) => (
              <ListItem disableGutters className={classes.listItem}>
                <Button
                  className={classes.listBtn}
                  onClick={() => history.push(item.path)}
                >
                  {item.icon && (
                    <item.icon style={{ marginRight: 10, width: 20 }} />
                  )}
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 500,
                    }}
                  >
                    {item.title}
                  </span>
                </Button>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem disableGutters className={classes.listItem}>
              <Button className={classes.listBtn} onClick={handleProfile}>
                <Lock style={{ marginRight: 10, width: 20 }} />

                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: 500,
                  }}
                >
                  {user[0] && user[0].length !== 0 ? "Sign Out" : "Sign In"}
                </span>
              </Button>
            </ListItem>
          </List>
          <Divider />
        </List>
        <div>
          <img className="header_logo" src={logo} alt="" />
        </div>
        <div id="copyright" slot="copyright" className="copyright">
          <div dir="ltr" style={{ display: "inline" }}>
            © 2021 A_phenomenal LLC
          </div>
        </div>
      </Box>
      <Box style={{ flexGrow: 1 }} />
    </>
  );

  return (
    <div className="sidepanel-cont">
      <div className="hideSidepanel">
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          classes={{
            paper: classes.drawerPaper_Mobile,
          }}
        >
          {content}
        </Drawer>
      </div>
      {shouldDisplay && (
        <div className="showSidepanel">
          <Drawer
            anchor="left"
            open
            variant="persistent"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {content}
          </Drawer>
        </div>
      )}
    </div>
  );
}

export default Sidepanel;
