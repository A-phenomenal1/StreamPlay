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
import defaultCover from "../assets/texture.jpeg";
import AlertBar from "../components/AlertBar";
import Loader from "../components/Loader";
import Dropzone from "react-dropzone";
import dev from "../api/dev";
import axios from "axios";
import "./AccountSetting.css";

const AccountSettings = () => {
  const [{ user }, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showBar, setShowBar] = useState({
    isShow: false,
    message: [],
    severity: "success",
  });
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profilePic: null,
    coverPic: null,
    prevProfilePic: null,
    prevCoverPic: null,
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
            setShowBar({
              isShow: true,
              message: [`Failed to save picture on server`],
              severity: "error",
            });
          }
        });
    } else
      setShowBar({
        isShow: true,
        message: [`Login First..`],
        severity: "error",
      });
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
                // update the writer object of all video.
                let updatedUser = {
                  _id: data._id,
                  color: data.color,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  profilePic: data.profilePic,
                  coverPic: data.coverPic,
                };
                console.log("updateUser: ", updatedUser);

                //For updating writer of comments

                fetch(`${dev.BaseUrl}/authusers/updatecommentwriter`, {
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
                      console.log("comments writer's updated: ", data);
                    } else {
                      console.log("Error: ", data.result);
                    }
                  })
                  .catch((err) => {
                    console.log("error: ", err);
                  });

                // For Update the writer of videos writer

                fetch(`${dev.BaseUrl}/authusers/updatevideowriter`, {
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
                      setLoading(false);
                    } else {
                      console.log("Error: ", data.result);
                    }
                  })
                  .catch((err) => {
                    console.log("error: ", err);
                  });

                // Deletion of Pics from cloud.....

                let changedProfile = [];

                if (values.prevCoverPic !== values.coverPic)
                  changedProfile.push({ fileType: "Cover" });
                if (values.prevProfilePic !== values.profilePic)
                  changedProfile.push({ fileType: "Profile" });
                for (let i = 0; i < changedProfile.length; ++i) {
                  fetch(`${dev.BaseUrl}/authusers/deleteprofile`, {
                    method: "PATCH",
                    headers: {
                      "auth-token": localStorage.getItem("JwtAuthToken"),
                      "content-type": "application/json",
                    },
                    body: JSON.stringify({
                      prevProfilePic:
                        changedProfile[i].fileType === "Profile"
                          ? values.prevProfilePic
                          : values.prevCoverPic,
                    }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      console.log("data from delete: ", data);
                      if (data.success) {
                        console.log("deleted successfully");
                      } else {
                        console.log("deletion unsuccessfull", data.error);
                      }
                    })
                    .catch((err) =>
                      console.log("error in deletion profile from cloud:", err)
                    );
                }

                dispatch({
                  type: "SET_USER",
                  user: [data],
                });
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
          prevProfilePic: data.profilePic || null,
          prevCoverPic: data.coverPic || null,
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
        {loading ? (
          <Loader type="bars" color="#ffcc33" hgt="calc(100% - 100px)" />
        ) : null}
        {showBar.isShow ? (
          <AlertBar
            hideBar={() => setShowBar((prev) => ({ ...prev, isShow: false }))}
            message={showBar.message}
            type={showBar.severity}
          />
        ) : null}
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
                    : `url(${values.coverPic})`,
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
                <Avatar src={`${values.profilePic}`} className="avt-style" />
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
              <Typography
                color="textSecondary"
                variant="body1"
                style={{
                  display: "flex",
                  width: "93%",
                  justifyContent: "center",
                }}
              >
                Email Id:
                <span className="control-char">{user[0] && user[0].email}</span>
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
                            <span style={{ color: "#ea4335" }}>
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
                            <span style={{ color: "#ea4335" }}>
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
                            <span style={{ color: "#ea4335" }}>
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
                        style={{
                          backgroundColor: "#2b333f",
                          color: "#f7f7f7",
                          height: 40,
                        }}
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
                        style={{
                          backgroundColor: "#2b333f",
                          color: "#f7f7f7",
                          height: 40,
                        }}
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
