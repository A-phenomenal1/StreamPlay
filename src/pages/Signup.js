import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Loader from "../components/Loader";
import logo from "../assets/icons/streamplay3.png";
import dev from "../api/dev";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        www.StreamPlay.com
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    subscribedBy: [],
    subscribedTo: [],
    likedVideos: { likes: [], dislikes: [] },
  });
  const [error, setError] = useState(false);

  function randomColor() {
    let hex = Math.floor(Math.random() * 0xffffff);
    let color = "#" + hex.toString(16);

    return color;
  }

  const handleSubmit = () => {
    setLoading(true);
    const {
      firstName,
      lastName,
      email,
      password,
      subscribedBy,
      subscribedTo,
      likedVideos,
    } = state;
    console.log("state: ", state);
    if (firstName === "" || lastName === "" || email === "" || password === "")
      setError(true);
    else {
      const color = randomColor();
      fetch(`${dev.BaseUrl}/users/signup`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          color: color,
          subscribedBy,
          subscribedTo,
          likedVideos,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setLoading(false);
          history.push("/signin");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      {loading ? (
        <div className="loader">
          <Loader type="spinningBubbles" color="#d1d1d1" />
        </div>
      ) : null}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <div className="logo_container_signPage">
            <img className="header_logo" src={logo} alt="" />
          </div>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    firstName: e.target.value,
                  }))
                }
                helperText={
                  state.firstName === "" && error ? (
                    <span style={{ color: "red" }}>*Required Field</span>
                  ) : null
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    lastName: e.target.value,
                  }))
                }
                helperText={
                  state.lastName === "" && error ? (
                    <span style={{ color: "red" }}>*Required Field</span>
                  ) : null
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    email: e.target.value,
                  }))
                }
                helperText={
                  state.email === "" && error ? (
                    <span style={{ color: "red" }}>*Required Field</span>
                  ) : null
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    password: e.target.value,
                  }))
                }
                helperText={
                  state.password === "" && error ? (
                    <span style={{ color: "red" }}>*Required Field</span>
                  ) : null
                }
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    </>
  );
}
