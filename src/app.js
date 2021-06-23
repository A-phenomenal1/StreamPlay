const express = require("express");
const bodyParser = require("body-parser");
const ffmpeg = require("fluent-ffmpeg");
const cors = require("cors");
const cloudinary = require("cloudinary");
const port = process.env.PORT || 3050;

const {
  userController,
  authUserController,
} = require("./controllers/user.controller");
const authorization = require("./api/middleware/auth");
const videoController = require("./controllers/video.controller");
const commentController = require("./controllers/comment.controller");
const upload = require("./api/middleware/video-upload");
require("./db");
require("dotenv").config();
require("./config/cloudinary");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("This is the backend");
});

app.get("/api/users/getUser/:id", userController);
app.get("/api/video/getvideo/:id", videoController);
app.use("/api/authusers", authorization, authUserController);
app.use("/api/users", userController);
app.use("/api/video", videoController);
app.use("/api/comments", commentController);

// This route is used for getting images/videos from node server.
app.use("/api/uploads", express.static("uploads"));

//routes for uploading file currently on /uploads
app.post("/api/uploadvideofile", upload.single("file"), videoController);
//routes for uploading image currently in /uploads
app.post("/api/uploadprofilepic", upload.single("file"), userController);

//route for generating thumbnail through 'ffmpeg' and store it in /uploads
app.post("/api/uploadthumbnailfile", (req, res) => {
  let thumbsFilePath = "";
  let fileDuration = "";
  let result;
  console.log("req.body in uploadthumbnail: ", req.body);

  ffmpeg.ffprobe(req.body.filePathInDisk, (err, metadata) => {
    fileDuration = metadata.format.duration;
  });

  ffmpeg(req.body.filePathInDisk)
    .on("progress", function (progress) {
      console.log("Processing: " + progress.percent + "% done");
    })
    .on("filenames", async function (filenames) {
      console.log("Will generate " + filenames.join(", "));
      thumbsFilePath = "uploads/thumbnails/" + filenames[0];
    })
    .on("error", function (err) {
      console.log("an error happened: " + err.message);
    })
    .on("end", async function () {
      console.log("Screenshots taken");
      try {
        result = await cloudinary.v2.uploader.upload(thumbsFilePath);
        console.log("result: ", result);
        return res.json({
          success: true,
          thumbsFilePath: result.url,
          fileDuration: fileDuration,
        });
      } catch (error) {
        console.log("error in thumbnail upload", error);
        return res.json({
          success: false,
          data: "error in thumbnail upload",
        });
      }
    })
    .screenshots({
      count: 1,
      folder: "uploads/thumbnails",
      size: "1366x768",
      filename: "thumbnail-%b.png",
    });
});

app.listen(port, () => {
  console.log(`Server is up at port ${port}`);
});