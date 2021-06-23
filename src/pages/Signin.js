import React, { useState } from "react";
import GoogleLogin from "react-google-login";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useHistory } from "react-router-dom";
import { useStateValue } from "../config/StateProvider";
import logo from "../assets/icons/streamplay3.png";
import Loader from "../components/Loader";
import dev from "../api/dev";

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
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();
  const classes = useStyles();

  const handleLogin = async (user) => {
    setLoading(true);
    const { email, password } = state;
    if (email !== "" || password !== "" || user.email !== "") {
      let body;
      if (email === "") {
        body = {
          email: user.email,
          password: user.password,
        };
      } else {
        body = {
          email: email,
          password: password,
        };
      }
      console.log("body: ", body);
      await fetch(`${dev.BaseUrl}/users/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ ...body }),
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.removeItem("JwtAuthToken");
          localStorage.removeItem("recent-play");
          localStorage.setItem("JwtAuthToken", data);
          localStorage.setItem("recent-play", JSON.stringify([]));
          fetch(`${dev.BaseUrl}/authusers`, {
            method: "GET",
            headers: {
              "auth-token": data,
              "content-type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((data) => {
              dispatch({
                type: "SET_USER",
                user: [data],
              });
              setLoading(false);
              console.log("Logged user: ", data);
              history.push("/");
            })
            .catch((err) => {
              console.log("Error in jwt code ", err);
              setLoading(false);
              alert("Wrong Email or Password!!!");
            });
        })
        .catch((err) => {
          console.log("check", err);
        });
    } else {
      setError(true);
    }
  };

  const responseGoogle = (response) => {
    console.log("response from google:", response.profileObj);
    var user = {
      email: response.profileObj.email,
      password: response.profileObj.googleId,
    };
    handleLogin(user);
  };

  return (
    <>
      {loading ? (
        <div className="loader">
          <Loader type="spin" color="#ffcc33" />
        </div>
      ) : null}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <div className="logo_container_signPage">
            <img className="header_logo" src={logo} alt="" />
          </div>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <div className="google-btn">
            <GoogleLogin
              clientId="968054575994-cpmlqqijucnihgmhak7qt5cuv2aej4bh.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
              style={{ width: "100%" }}
            />
          </div>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
          <TextField
            variant="outlined"
            margin="normal"
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
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleLogin}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </>
  );
}
