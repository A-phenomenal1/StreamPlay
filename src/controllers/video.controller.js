const adaptRequest = require("../helpers/adapt-request");
const handleVideosRequests = require("../api/routes/video.router");

// video controller for video routes

function videoController(req, res) {
  const httpRequest = adaptRequest(req);
  handleVideosRequests(httpRequest)
    .then(({ headers, statusCode, data }) => {
      console.log("statusCode: ", statusCode);
      res.set(headers).status(statusCode).send(data);
    })
    .catch((e) => {
      console.log("statusCode: ", 500, e);
      res.status(500).send(e).end();
    });
}

module.exports = videoController;
