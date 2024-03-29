exports.articleNotFoundError = (err, req, res, next) => {
  if (err.msg === "Not Found") {
    res.status(404).send({ msg: "article does not exist" });
  } else {
    next(err);
  }
};

exports.commentNotFoundError = (err, req, res, next) => {
  if (err.msg === "Comment Not Found") {
    res.status(404).send({ msg: "comment does not exist" });
  } else {
    next(err);
  }
};

exports.invalidError = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

exports.invalidRequestBodyError = (err, req, res, next) => {
  if (err.code === "23503") {
    res.status(400).send({ msg: "Invalid Schema. Bad Request" });
  } else if (err.msg == "Incorrect Type") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

exports.NoRequestBodyError = (err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ msg: "No Request body. Bad Request" });
  } else {
    next(err);
  }
};

exports.NotTopicError = (err, req, res, next) => {
  if (err.msg === "Topic Not Found") {
    res.status(404).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.invalidSortError = (err, req, res, next) => {
  if (err.msg === "Invalid sort query") {
    res.status(400).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.invalidOrderError = (err, req, res, next) => {
  if (err.msg === "Invalid order query") {
    res.status(400).send({ msg: err.msg });
  } else {
    next(err);
  }
};
