const adaptRequest = require("../helpers/adapt-request");
const handleUsersRequests = require("../api/routes/users.router");
const handleAuthUsersRequests = require("../api/routes/users.auth-router");

// user controller for non auth routes

function userController(req, res) {
  const httpRequest = adaptRequest(req);
  handleUsersRequests(httpRequest)
    .then(({ headers, statusCode, data }) =>
      res.set(headers).status(statusCode).send(data)
    )
    .catch((e) => res.status(500).send(e).end());
}

//user controller for auth routes or private routes

function authUserController(req, res) {
  const httpRequest = adaptRequest(req);
  handleAuthUsersRequests(httpRequest)
    .then(({ headers, statusCode, data }) =>
      res.set(headers).status(statusCode).send(data)
    )
    .catch((e) => res.status(500).end());
}

module.exports = { userController, authUserController };
