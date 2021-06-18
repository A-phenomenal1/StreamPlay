import React from "react";
import { useHistory } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import dev from "../api/dev";
import "./SideMediaCard.css";

export default function SideMediacard({
  _id,
  img,
  title,
  views,
  date,
  writer,
  category,
  duration,
}) {
  const history = useHistory();

  const changeVideo = () => {
    history.push(`/video/${_id}`);
    window.location.reload(false);
  };

  return (
    <Card className="root" onClick={changeVideo}>
      <CardMedia
        className="cover"
        image={`${dev.BaseUrl}/${img}`}
        title={title}
      />
      <div className="duration">{duration}</div>
      <div className="details">
        <CardContent className="content">
          <Typography component="h5" variant="h6" className="scard-title">
            {title}
          </Typography>
          <div>
            <Typography variant="subtitle1" color="textSecondary" component="p">
              {writer.firstName} {writer.lastName}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              noWrap
            >
              {category}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {views} Views - {date}
            </Typography>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
