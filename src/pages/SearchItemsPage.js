import React from "react";
import { Avatar, Container, Typography } from "@material-ui/core";
import { Tune } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import dev from "../api/dev";
import "./SearchItemsPage.css";

export function SearchCard({
  id,
  src,
  title,
  views,
  date,
  writer,
  description,
}) {
  const history = useHistory();

  const changeVideo = () => {
    history.push(`/video/${id}`);
    window.location.reload(false);
  };

  return (
    <div className="search-card">
      <div className="thumbnail-container" onClick={changeVideo}>
        <img
          src={`${dev.BaseUrl}/${src}`}
          width="100%"
          height="100%"
          alt="thumbnail"
        />
      </div>
      <div className="details-container">
        <div className="item-title-cont">
          <Typography className="item-title tooltip line-after2">
            {title}
          </Typography>
          <Typography
            component="body"
            variant="subtitle2"
            className="subtitle-style"
          >
            <span>{views}</span>&nbsp;views &bull; <span>{date}</span>
          </Typography>
        </div>
        <div className="writer-intro">
          <Avatar
            style={{
              width: 20,
              height: 20,
              backgroundColor: writer.color,
            }}
          >
            {writer.firstName[0]}
          </Avatar>
          <Typography
            component="h2"
            variant="subtitle2"
            className="writer-name"
          >
            <span>{writer.firstName}</span>&nbsp;
            <span>{writer.lastName}</span>
          </Typography>
        </div>
        <div className="tooltip line-after2 item-desc">
          <Typography component="h2" variant="body2">
            {description}
          </Typography>
        </div>
      </div>
    </div>
  );
}

function SearchItemsPage() {
  const history = useHistory();
  const { searchString, response } = history.location.state;

  return (
    <Container component="main">
      <div className="top-header-cont">
        <Tune style={{ marginRight: "0.5em" }} />
        <Typography component="h2" variant="h6">
          Filters
        </Typography>
      </div>
      <div className="underline" />
      <div style={{ margin: "10px 0" }}>
        <Typography component="h2" variant="h6" className="search-string">
          Search result for <span>"&nbsp;{searchString}&nbsp;</span>"
        </Typography>
        <div style={{ marginTop: "1em" }} />
        <div className="vids-container2 align-center">
          {response.map((item) => (
            <SearchCard
              key={item.id}
              id={item.videoInfo._id}
              src={item.videoInfo.thumbnail}
              title={item.videoInfo.title}
              views={item.videoInfo.views}
              date={item.videoInfo.createdAt}
              writer={item.videoInfo.writer}
              description={item.videoInfo.description}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}

export default SearchItemsPage;
