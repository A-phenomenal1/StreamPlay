import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import GoogleLogin from "react-google-login";
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
import AlertBar from "../components/AlertBar";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="">
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
    backgroundColor: "#0c5670",
    "&:hover": {
      backgroundColor: "#073c4f !important",
    },
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [showBar, setShowBar] = useState({
    isShow: false,
    message: [],
    severity: "success",
  });
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    subscribedBy: [],
    subscribedTo: [],
    likedVideos: { likes: [], dislikes: [] },
    likedComments: { likes: [], dislikes: [] },
    profilePic: null,
    coverPic: null,
  });
  const [error, setError] = useState(false);

  const randomColor = () => {
    let hex = Math.floor(Math.random() * 0xffffff);
    let color = "#" + hex.toString(16);

    return color;
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (user) => {
    const {
      firstName,
      lastName,
      email,
      password,
      subscribedBy,
      subscribedTo,
      likedVideos,
      likedComments,
      profilePic,
      coverPic,
    } = state;
    console.log("state: ", state);
    if (
      user.firstName === undefined &&
      (firstName === "" || lastName === "" || email === "" || password === "")
    )
      setError(true);
    if (!validateEmail(email)) {
      setError(true);
    } else {
      setLoading(true);
      const color = randomColor();
      let body;
      if (user.firstName !== undefined) {
        body = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          color: color,
          subscribedTo: subscribedTo,
          subscribedBy: subscribedBy,
          likedVideos: likedVideos,
          likedComments: likedComments,
          profilePic: user.profilePic,
          coverPic: coverPic,
        };
      } else {
        body = {
          firstName,
          lastName,
          email,
          password,
          color: color,
          subscribedBy,
          subscribedTo,
          likedVideos,
          likedComments,
          profilePic,
          coverPic,
        };
      }
      fetch(`${dev.BaseUrl}/users/signup`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ ...body }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setLoading(false);
          setShowBar({
            isShow: true,
            message: ["Signup successful, Signin please"],
            severity: "success",
          });
          history.push("/signin");
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setShowBar({
            isShow: true,
            message: ["Something wrong occured!!"],
            severity: "error",
          });
        });
    }
  };

  const responseGoogle = (response) => {
    console.log("response from google:", response.profileObj);
    let user = {
      firstName: response.profileObj.familyName,
      lastName: response.profileObj.givenName,
      email: response.profileObj.email,
      password: response.profileObj.googleId,
      profilePic: response.profileObj.imageUrl,
    };
    console.log("state: ", state);
    handleSubmit(user);
  };

  return (
    <>
      {loading ? (
        <div className="loader">
          <Loader type="spin" color="#ffcc33" />
        </div>
      ) : null}
      <Container component="main" maxWidth="xs">
        {showBar.isShow ? (
          <AlertBar
            hideBar={() => setShowBar((prev) => ({ ...prev, isShow: false }))}
            message={showBar.message}
            type={showBar.severity}
          />
        ) : null}
        <CssBaseline />
        <div className={classes.paper}>
          <div className="logo_container_signPage">
            <img className="header_logo" src={logo} alt="" />
          </div>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <div className="google-btn">
            <GoogleLogin
              clientId="968054575994-cpmlqqijucnihgmhak7qt5cuv2aej4bh.apps.googleusercontent.com"
              buttonText="SignUp"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
            />
          </div>
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
                    <span style={{ color: "#ea4335" }}>*Required Field</span>
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
                    <span style={{ color: "#ea4335" }}>*Required Field</span>
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
                    <span style={{ color: "#ea4335" }}>*Required Field</span>
                  ) : error && state.email !== "" ? (
                    <span style={{ color: "#ea4335" }}>*Not a valid Email</span>
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
                    <span style={{ color: "#ea4335" }}>*Required Field</span>
                  ) : null
                }
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            color="primary"
            variant="contained"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/signin" variant="body2" style={{ color: "#db6939" }}>
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
