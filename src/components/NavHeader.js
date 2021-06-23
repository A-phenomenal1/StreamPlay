import React, { useState, useEffect } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { AppBar, Avatar, Box, IconButton, Toolbar } from "@material-ui/core";
import { Menu as MenuIcon, VideoCall, Notifications } from "@material-ui/icons";
import { useStateValue } from "../config/StateProvider";
import PropTypes from "prop-types";
import logo from "../assets/icons/streamplay3.png";
import dev from "../api/dev";
import "./NavHeader.css";

const NavHeader = ({ onMobileNavOpen }) => {
  const [load, setLoad] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [items, setItems] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();

  useEffect(() => {
    let searchedItems = [];
    if (searchKey.length >= 2)
      fetch(`${dev.BaseUrl}/video/searchvideo?searchKey=${searchKey}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log({ data });
          if (data.success) {
            data.videos.map((video, index) => {
              if (
                items.indexOf({
                  id: index,
                  name: video.title,
                  videoInfo: video,
                }) === -1
              )
                searchedItems.push({
                  id: index,
                  name: video.title,
                  videoInfo: video,
                });
            });
          }
          setItems([...searchedItems]);
        });
  }, [searchKey]);

  const handleOnSearch = (string, results) => {
    console.log(string, results);
    setSearchKey(string);
  };

  const handleOnHover = (result) => {
    console.log(result);
  };

  const handleOnSelect = (item) => {
    console.log(item);
    history.push(`/search?q=${searchKey}`, {
      searchString: searchKey,
      response: items,
    });
  };

  const handleOnFocus = () => {
    console.log("Focused");
  };

  const handleEnterTapped = (e) => {
    if (e.keyCode === 13) {
      history.push(`/search?q=${searchKey}`, {
        searchString: searchKey,
        response: items,
      });
    }
  };

  useEffect(() => {
    console.log("user in navbar: ", user);
    setLoad(!load);
  }, [user]);

  useEffect(() => {
    let inputselector = document.querySelector(".fhmJc").children[1];
    inputselector.addEventListener("keydown", handleEnterTapped);

    return () => {
      inputselector.removeEventListener("keydown", handleEnterTapped);
    };
  }, [items]);

  return (
    <AppBar elevation={0} className="nav_container">
      <Toolbar>
        <div className="hideSidepanel">
          <IconButton color="inherit" onClick={onMobileNavOpen}>
            <MenuIcon />
          </IconButton>
        </div>
        <RouterLink to="/">
          <div className="logo_container">
            <img className="header_logo" src={logo} alt="" />
          </div>
        </RouterLink>
        <Box style={{ flexGrow: 1 }} />
        <div className="search-box">
          <ReactSearchAutocomplete
            items={items}
            onSearch={handleOnSearch}
            placeholder="search videos"
            onHover={handleOnHover}
            onSelect={handleOnSelect}
            onFocus={handleOnFocus}
            styling={{
              backgroundColor: "rgba(82, 82, 82, 0.891)",
              iconColor: "#fff",
              color: "#d1d1d1",
              border: "1px solid transparent",
            }}
          />
        </div>
        <Box style={{ flexGrow: 1 }} />
        <div className="nav_icon_container">
          <div
            className="nav_profile_icons"
            id="upload"
            onClick={() => history.push("/uploadvideo")}
          >
            <VideoCall style={{ width: 30, height: 30 }} />
            <span className="icon-name">Upload Video</span>
          </div>
          <div className="nav_profile_icons" id="notifications">
            <Notifications style={{ width: 30, height: 30 }} />
            <span className="icon-name">Notifications</span>
          </div>
          <div className="nav_profile_icons" id="account">
            {user.length !== 0 ? (
              user[0].profilePic === null ? (
                <Avatar
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: user[0].color,
                  }}
                >
                  {user[0].firstName[0]}
                </Avatar>
              ) : (
                <Avatar
                  src={`${user[0].profilePic}`}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
              )
            ) : (
              <Avatar
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            )}
            <span className="icon-name">
              Hi, {user.length !== 0 ? user[0].firstName : "Guest"}
            </span>
          </div>
        </div>
      </Toolbar>
      <div className="search-box1">
        <ReactSearchAutocomplete
          items={items}
          onSearch={handleOnSearch}
          placeholder="search videos"
          onHover={handleOnHover}
          onSelect={handleOnSelect}
          onFocus={handleOnFocus}
          styling={{
            backgroundColor: "rgba(82, 82, 82, 0.891)",
            iconColor: "#fff",
            color: "#d1d1d1",
            border: "1px solid transparent",
          }}
        />
      </div>
    </AppBar>
  );
};

NavHeader.propTypes = {
  onMobileNavOpen: PropTypes.func,
};

export default NavHeader;
