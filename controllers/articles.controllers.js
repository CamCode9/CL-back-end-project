const { selectArticlesById } = require("../models/articles.models");

exports.getArticlesById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const result = await selectArticlesById(article_id, next);
    res.status(200).send({ article: result });
  } catch (err) {
    next(err);
  }
};

exports.getAllArticles = async (req, res, next) => {
  try {
    const result = await selectArticlesById();
  } catch (err) {}
};
