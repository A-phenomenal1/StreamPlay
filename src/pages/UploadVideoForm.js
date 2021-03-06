import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  CssBaseline,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import Dropzone from "react-dropzone";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Add, CloudUpload } from "@material-ui/icons";
import { useStateValue } from "../config/StateProvider";
import "./UploadVideoForm.css";
import dev from "../api/dev";
import Loader from "../components/Loader";
import AlertModal from "../components/AlertModal";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
  },
}));

const Privacy = [
  { value: 0, label: "Public" },
  { value: 1, label: "Private" },
];

const Category = [
  { value: 0, label: "Education" },
  { value: 0, label: "Movies" },
  { value: 0, label: "Music" },
  { value: 0, label: "Sports" },
  { value: 0, label: "Kids" },
];

function UploadVideoForm() {
  const classes = useStyles();
  const [{ user }, dispatch] = useStateValue();
  const [showModal, setShowModal] = useState({ isShow: false, message: [] });
  const [state, setState] = useState({
    filePath: "",
    title: "",
    description: "",
    privacy: "Public",
    views: 0,
    likes: 0,
    dislikes: 0,
    category: "Education & Arts",
    duration: "",
    thumbnail: "",
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const onDrop = async (file) => {
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
        .post(`${dev.BaseUrl}/uploadvideofile`, formData, config)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            let variable = {
              filePath: res.data.filePath,
              fileName: res.data.fileName,
              filePathInDisk: res.data.filePathInDisk,
            };
            setState((prevState) => ({
              ...prevState,
              filePath: res.data.filePath,
            }));
            //generate Thumbnails

            axios
              .post(`${dev.BaseUrl}/uploadthumbnailfile`, variable)
              .then((res) => {
                if (res.data.success) {
                  setState((prevState) => ({
                    ...prevState,
                    duration: res.data.fileDuration,
                    thumbnail: res.data.thumbsFilePath,
                  }));
                  setLoading(false);
                } else {
                  setShowModal({
                    isShow: true,
                    message: ["Whoops!", `Error in generating thumbnails.`],
                  });
                }
              })
              .catch((e) => {
                console.log("error: ", e);
              });
          } else {
            setShowModal({
              isShow: true,
              message: ["Whoops!", `Failed to save video on server.`],
            });
            console.log("error in uploading video: ", res.data);
          }
        });
    } else
      setShowModal({
        isShow: true,
        message: ["Whoops!", `You should Login first...`],
      });
  };

  const onUpload = async () => {
    const {
      filePath,
      title,
      description,
      privacy,
      views,
      likes,
      dislikes,
      category,
      duration,
      thumbnail,
    } = state;
    if (title === "" || description === "" || filePath === "") setError(true);
    else if (user.length === 0)
      setShowModal({
        isShow: true,
        message: ["Whoops!", `You should Login first...`],
      });
    else {
      await fetch(`${dev.BaseUrl}/video/uploadvideo`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          writer: user[0],
          title,
          description,
          filePath,
          views,
          likes,
          dislikes,
          privacy,
          category,
          duration,
          thumbnail,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.success) {
            setShowModal({
              isShow: true,
              message: ["Bravo!", `Video uploaded successful, Check it out!`],
            });
            history.push("/");
          } else {
            setShowModal({
              isShow: true,
              message: ["Whoops!", `${data.error}`],
            });
          }
        })
        .catch((err) => {
          console.log("Error:", err);
        });
    }
  };

  useEffect(() => {
    if (window.innerWidth <= 480) {
      let inputselector = document.querySelector("#upload-video").children[0];
      inputselector.setAttribute("disabled", "");
    }
  }, []);

  return (
    <>
      {window.innerWidth >= 480 ? (
        <Alert severity="warning">
          It is necessary to install{" "}
          <b>
            <i>ffmpeg</i>
          </b>{" "}
          to upload any video. Check out Read Me or About us in the application.
        </Alert>
      ) : (
        <Alert severity="error">
          The video upload feature doesn't work on smartphone, I'll update
          shortly, sorry for the inconvenience.
        </Alert>
      )}
      <Container component="main" maxWidth="md">
        {showModal.isShow ? (
          <AlertModal
            hideModal={() =>
              setShowModal((prev) => ({ ...prev, isShow: false }))
            }
            message={showModal.message}
          />
        ) : null}
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h4" className="title">
            Upload video
          </Typography>
          <div
            style={{
              display: "flex",
            }}
          >
            <Dropzone onDrop={onDrop} multiple={false} maxSize={800000000}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div
                    {...getRootProps()}
                    className="dropzone"
                    id="upload-video"
                  >
                    <input {...getInputProps()} />
                    <Add style={{ width: 40, height: 40 }} />
                  </div>
                  {state.filePath === "" && error ? (
                    <div style={{ color: "#ea4335" }}>*Required Field</div>
                  ) : null}
                </section>
              )}
            </Dropzone>
            {loading ? (
              <Loader type="spin" color="#ffcc33" />
            ) : (
              state.thumbnail && (
                <div>
                  <img
                    className="thumb-prop"
                    src={`${state.thumbnail}`}
                    alt="thumbnail"
                  />
                </div>
              )
            )}
          </div>

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="title"
            label="Title"
            name="title"
            autoComplete="title"
            onChange={(e) =>
              setState((prevState) => ({
                ...prevState,
                title: e.target.value,
              }))
            }
            helperText={
              state.title === "" && error ? (
                <span style={{ color: "#ea4335" }}>*Required Field</span>
              ) : null
            }
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="description"
            label="Description"
            name="description"
            autoComplete="description"
            multiline
            rows={4}
            onChange={(e) =>
              setState((prevState) => ({
                ...prevState,
                description: e.target.value,
              }))
            }
            helperText={
              state.description === "" && error ? (
                <span style={{ color: "#ea4335" }}>*Required Field</span>
              ) : null
            }
          />
          <br />

          <select
            onChange={(e) =>
              setState((prevState) => ({
                ...prevState,
                privacy: Privacy[e.target.value].label,
              }))
            }
            style={{ width: "100px" }}
            className="selector"
          >
            {Privacy.map((item, index) => (
              <option key={index} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <br />

          <select
            onChange={(e) =>
              setState((prevState) => ({
                ...prevState,
                category: e.target.value,
              }))
            }
            style={{
              width: "150px",
            }}
            className="selector"
          >
            {Category.map((item, index) => (
              <option key={index} value={item.label}>
                {item.label}
              </option>
            ))}
          </select>
          <br />
          <br />
        </div>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          className="upload-btn"
          onClick={onUpload}
        >
          Upload
        </Button>
        <br />
        <br />
      </Container>
    </>
  );
}

export default UploadVideoForm;
