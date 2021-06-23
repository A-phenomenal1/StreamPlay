import React from "react";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { WhatshotRounded } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { Avatar, Grid } from "@material-ui/core";
import dev from "../api/dev";
import formatTimestamp from "../config/formatTimestamp";

const useStyles = makeStyles((theme) => ({
  root: {
    border: "none",
    boxShadow: "none",
    marginRight: "1em",
    margin: "0.5em 0",
    boxSizing: "border-box",
    [theme.breakpoints.down("sm")]: {
      minWidth: 280,
      maxWidth: 280,
    },
  },

  media: {
    height: 160,
    cursor: "pointer",
  },
  duration: {
    float: "right",
    marginTop: -18,
    backgroundColor: "rgba(41, 46, 56, 0.531)",
    padding: "1px 5px",
    fontSize: "14px",
  },
  tooltip: {
    display: "-webkit-box",
    boxOrient: "vertical",
    lineClamp: 2,
    overflow: "hidden",
    lineHeight: 1.1,
  },
  trend: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    filter: "blur(0.5px)",
    padding: "1px 3px",
    color: "#fff",
    fontWeight: 500,
    backgroundColor: "#125670bf",
    overflow: "hidden",
  },
}));

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

export default function MediaCard({
  at,
  _id,
  img,
  title,
  views,
  date,
  writer,
  duration,
  width,
  height,
  page,
}) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <ThemeProvider theme={theme}>
      <Grid container item lg={4} md={6} sm={12}>
        <Card
          className={classes.root}
          style={{ minWidth: width || 320, maxWidth: width || 320 }}
        >
          {page && (
            <div className={classes.trend}>
              <WhatshotRounded style={{ color: "#E48900" }} /> #
              <span>{at}&nbsp;</span> Trending
            </div>
          )}
          <CardMedia
            className={classes.media}
            style={{ height: height }}
            image={`${img}`}
            title={title}
            onClick={() => history.push(`/video/${_id}`)}
          />
          <div className={classes.duration}>{duration}</div>
          <CardContent style={{ backgroundColor: "#282828" }}>
            <div style={{ display: "flex" }}>
              {writer.profilePic === null ? (
                <Avatar
                  style={{
                    width: 40,
                    height: 40,
                    marginRight: 10,
                    marginLeft: -8,
                    backgroundColor: writer.color,
                  }}
                >
                  {writer.firstName[0]}
                </Avatar>
              ) : (
                <Avatar
                  src={`${writer.profilePic}`}
                  style={{
                    width: 40,
                    height: 40,
                    marginRight: 10,
                    marginLeft: -8,
                  }}
                />
              )}
              <Typography
                gutterBottom
                variant="body1"
                component="h2"
                className={classes.tooltip}
              >
                {title}
              </Typography>
            </div>
            <div style={{ margin: "-10px 0 -15px 40px" }}>
              <Typography variant="body2" color="textSecondary" component="p">
                {writer.firstName} {writer.lastName}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {views} views &bull; {formatTimestamp(date)}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </ThemeProvider>
  );
}
