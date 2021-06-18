//It just rid our project dependency from too many libraries.

function adaptRequest(req = {}) {
  return Object.freeze({
    path: req.path,
    method: req.method,
    pathParams: req.params,
    queryParams: req.query,
    body: req.body,
    user: req.user, // from user middleware
    file: req.file, // from video middleware
  });
}

module.exports = adaptRequest;
