const multer = require("multer");
const mkdirp = require("mkdirp");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dest = "uploads/";
    mkdirp.sync(dest);
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".mp4" || ext !== ".jpg" || ext !== ".jpeg") {
      return cb(
        res.status(400).end("ony mp4/jpg/jpeg files are allowed"),
        false
      );
    }
    cb(null, true);
  },
});

var upload = multer({ storage: storage });

module.exports = upload;
