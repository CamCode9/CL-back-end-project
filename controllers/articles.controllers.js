const { selectAllArticles } = require("../models/articles.models");

exports.getArticles = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const result = await selectAllArticles(article_id);
    res.status(200).send({ article: result });
  } catch (err) {
    next(err);
  }
};
