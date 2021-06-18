const adaptRequest = require("../helpers/adapt-request");
const handleCommentsRequests = require("../api/routes/comment.router");

function commentController(req, res) {
  const httpRequest = adaptRequest(req);
  console.log("httpRequest: ", httpRequest);
  handleCommentsRequests(httpRequest)
    .then(({ headers, statusCode, data }) => {
      console.log("statusCode: ", statusCode);
      res.set(headers).status(statusCode).send(data);
    })
    .catch((e) => {
      console.log("statusCode: ", 500, e);
      res.status(500).send(e).end();
    });
}

module.exports = commentController;
