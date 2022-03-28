const {
  selectAllArticles,
  selectArticlesById,
} = require("../models/articles.models");

exports.getArticles = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const result = await selectArticlesById(article_id, next);
    res.status(200).send({ article: result });
  } catch (next) {
    console.log("Something went wrong....");
  }
};
