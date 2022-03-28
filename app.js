const express = require("express");
const { getArticles } = require("./controllers/articles.controllers");
const { getTopics } = require("./controllers/topics.controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticles);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
});

//handle unexpected errors
// app.use((err, req, res, next) => {
//   console.log(err, "<< UNEXPECTED ERROR");
//   res.status(500).send({ msg: "Internal server error" });
// });

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
