import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { CameraAlt, Create, Delete } from "@material-ui/icons";
import { useStateValue } from "../config/StateProvider";
import "./AccountSetting.css";
import defaultCover from "../assets/texture.jpeg";
import axios from "axios";
import dev from "../api/dev";
import Dropzone from "react-dropzone";
import Loader from "../components/Loader";

const AccountSettings = () => {
  const [{ user }, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profilePic: null,
    coverPic: null,
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleProfileChange = async (file, fileType) => {
    if (user.length !== 0) {
      setLoading(true);
      let formData = new FormData();
      const config = {
        header: {
          "content-type": "multipart/form-data",
        },
      };
      console.log("file:", file);
      formData.append("file", file[0]);
      axios
        .post(`${dev.BaseUrl}/uploadprofilepic`, formData, config)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            if (fileType === "Profile") {
              console.log("res: ", res.data);
              setValues((prevState) => ({
                ...prevState,
                profilePic: res.data.filePath,
              }));
            } else {
              setValues((prevState) => ({
                ...prevState,
                coverPic: res.data.filePath,
              }));
            }
            setLoading(false);
          } else {
            alert("failed to save picture on server.");
          }
        });
    } else alert("Please Login First!!!");
  };

  const handleSubmit = async () => {
    const { firstName, lastName, email } = values;
    if (firstName === "" || lastName === "" || email === "") setError(true);
    else if (
      firstName === user[0].firstName &&
      lastName === user[0].lastName &&
      email === user[0].email &&
      values.profilePic === (null || user[0].profilePic) &&
      values.coverPic === (null || user[0].coverPic)
    ) {
      console.log("No change...");
      return;
    } else {
      setLoading(true);
      fetch(`${dev.BaseUrl}/authusers/updateprofile`, {
        method: "PATCH",
        headers: {
          "auth-token": localStorage.getItem("JwtAuthToken"),
          "content-type": "application/json",
        },
        body: JSON.stringify({ ...values }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            fetch(`${dev.BaseUrl}/authusers`, {
              method: "GET",
              headers: {
                "auth-token": localStorage.getItem("JwtAuthToken"),
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
              })
              .catch((err) => {
                console.log("Error in jwt code ", err);
              });
          }
        })
        .catch((err) => {
          console.log("error: ", err);
        });

      // update the writer object of all video.
      let updatedUser = {
        _id: user[0]._id,
        color: user[0].color,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        profilePic: user[0].profilePic,
        coverPic: user[0].coverPic,
      };
      await fetch(`${dev.BaseUrl}/authusers/updatevideowriter`, {
        method: "PATCH",
        headers: {
          "auth-token": localStorage.getItem("JwtAuthToken"),
          "content-type": "application/json",
        },
        body: JSON.stringify({ ...updatedUser }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log("video writer's updated: ", data);
          } else {
            console.log("Error: ", data.result);
          }
        })
        .catch((err) => {
          console.log("error: ", err);
        });
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${dev.BaseUrl}/authusers`, {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("JwtAuthToken"),
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setValues({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          profilePic: data.profilePic || null,
          coverPic: data.coverPic || null,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log("check", err);
      });
  }, []);

  return (
    <>
      <Container maxWidth="lg" style={{ marginTop: 20, overflow: "hidden" }}>
        {loading ? <Loader type="spinningBubbles" color="#C84B31" /> : null}
        <Grid container spacing={3}>
          <Grid item lg={12} xs={12}>
            <Dropzone
              onDropAccepted={(file) => handleProfileChange(file, "Cover")}
              multiple={false}
              maxSize={800000000}
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="camera-cont">
                  <input {...getInputProps()} />
                  <CameraAlt style={{ color: "#d1d1d1" }} />
                </div>
              )}
            </Dropzone>
            <div
              className="picture-cont"
              style={{
                backgroundImage:
                  values.coverPic === null
                    ? `url(${defaultCover})`
                    : `url(${dev.BaseUrl}/${values.coverPic})`,
              }}
            >
              {values.profilePic === null ? (
                <Avatar
                  className="avt-style"
                  style={{
                    backgroundColor: user[0] && user[0].color,
                  }}
                >
                  {user[0] && user[0].firstName[0]}
                </Avatar>
              ) : (
                <Avatar
                  src={`${dev.BaseUrl}/${values.profilePic}`}
                  className="avt-style"
                />
              )}
              <Dropzone
                onDropAccepted={(file) => handleProfileChange(file, "Profile")}
                multiple={false}
                maxSize={800000000}
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()} className="pencil">
                    <input {...getInputProps()} />
                    <Create
                      style={{
                        fontSize: 20,
                        color: "#BF1363",
                      }}
                    />
                  </div>
                )}
              </Dropzone>
              <Typography color="textPrimary" gutterBottom variant="h4">
                {`${user[0] && user[0].firstName} ${
                  user[0] && user[0].lastName
                }`}
              </Typography>
              <Typography color="textSecondary" variant="body1">
                Email Id: {user[0] && user[0].email}
              </Typography>
            </div>
          </Grid>
          <Grid item lg={12} xs={12} style={{ margin: "10px 0 20px 0" }}>
            <form autoComplete="off" noValidate>
              <Card>
                <CardHeader
                  subheader="The information can be edited"
                  title="Profile"
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        helperText="Please specify the first name"
                        label="First name"
                        name="firstName"
                        onChange={handleChange}
                        required
                        value={values.firstName}
                        variant="outlined"
                        helperText={
                          values.firstName === "" && error ? (
                            <span style={{ color: "red" }}>
                              *Required Field
                            </span>
                          ) : null
                        }
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Last name"
                        name="lastName"
                        onChange={handleChange}
                        required
                        value={values.lastName}
                        variant="outlined"
                        helperText={
                          values.lastName === "" && error ? (
                            <span style={{ color: "red" }}>
                              *Required Field
                            </span>
                          ) : null
                        }
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        onChange={handleChange}
                        required
                        value={values.email}
                        variant="outlined"
                        helperText={
                          values.email === "" && error ? (
                            <span style={{ color: "red" }}>
                              *Required Field
                            </span>
                          ) : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                      style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        style={{ backgroundColor: "#F6C6EA", height: 40 }}
                        variant="contained"
                        onClick={() =>
                          setValues((prevState) => ({
                            ...prevState,
                            profilePic: null,
                          }))
                        }
                      >
                        <Delete style={{ fontSize: 20, color: "#C84B31" }} />
                        Profile
                      </Button>
                      <Button
                        style={{ backgroundColor: "#F6C6EA", height: 40 }}
                        variant="contained"
                        onClick={() =>
                          setValues((prevState) => ({
                            ...prevState,
                            coverPic: null,
                          }))
                        }
                      >
                        <Delete style={{ fontSize: 20, color: "#C84B31" }} />
                        Cover
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
                <Divider />
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: 20,
                  }}
                >
                  <Button
                    style={{ backgroundColor: "#fac564" }}
                    variant="contained"
                    onClick={handleSubmit}
                  >
                    Save details
                  </Button>
                </Box>
              </Card>
            </form>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AccountSettings;
