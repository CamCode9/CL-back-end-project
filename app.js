const express = require("express");
const { getApi } = require("./controllers/api.controllers");
const {
  patchArticle,
  getArticlesById,
  getAllArticles,
  getArticleComments,
  postComment,
  deleteComment,
} = require("./controllers/articles.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { getUsers } = require("./controllers/users.controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.get("/api", getApi);

app.patch("/api/articles/:article_id", patchArticle);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

/////////////////////////ERRORS BELOW/////////////////////////////

//handle psql err
app.use((err, req, res, next) => {
  const badReqCodes = ["22P02"];
  if (badReqCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

// handle custom err
app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

//handle any invalid/unspecified path
app.all("/*", (req, res, next) => {
  res.status(400).send({ msg: "Bad request" });
});

// handle unexpected errors
app.use((err, req, res, next) => {
  console.log(err, "<< UNEXPECTED ERROR");
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
