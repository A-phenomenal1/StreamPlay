import { makeStyles } from "@material-ui/core";
import React from "react";
import ReactLoading from "react-loading";

const useStyles = makeStyles((theme) => ({
  root: {
    // position: "absolute",
    display: "flex",
    position: "fixed",
    width: "calc(100% - 400px)",
    height: "calc(100% - 300px)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 18px)",
    },
  },
}));

function Loader({ type = "bars", color = "#555577" }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ReactLoading type={type} color={color} height={40} width={120} />
    </div>
  );
}

export default Loader;
