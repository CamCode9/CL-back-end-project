const { checkExists } = require("../db/helpers/utils");
const {
  selectAllArticles,
  selectArticlesById,
  updateArticleVoteById,
  selectCommentsByArticle,
  sendComment,
} = require("../models/articles.models");

exports.getArticlesById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const result = await selectArticlesById(article_id, next);
    res.status(200).send({ article: result[0] });
  } catch (err) {
    next(err);
  }
};

exports.getAllArticles = async (req, res, next) => {
  try {
    const result = await selectArticlesById();
    res.status(200).send({ articles: result });
  } catch (err) {
    next(err);
  }
};

exports.patchArticle = async (req, res, next) => {
  try {
    const voteInc = req.body.inc_votes;
    const article_id = req.params.article_id;
    const articleExists = await checkExists(
      "articles",
      "article_id",
      article_id
    );
    if (articleExists) {
      let updatedArticle = await updateArticleVoteById(article_id, voteInc);
      res.status(200).send({ updatedArticle });
    }
  } catch (err) {
    next(err);
  }
};

exports.getArticleComments = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const articleExists = await checkExists(
      "articles",
      "article_id",
      article_id
    );
    if (articleExists) {
      let result = await selectCommentsByArticle(article_id);
      res.status(200).send({ comments: result });
    }
  } catch (err) {
    next(err);
  }
};

exports.postComment = async (req, res, next) => {
  try {
    const author = req.body.username;
    const { body } = req.body;
    const { article_id } = req.params;

    const articleExists = await checkExists(
      "articles",
      "article_id",
      article_id
    );
    const userExists = await checkExists("users", "username", author);

    if (articleExists && userExists) {
      let result = await sendComment(article_id, author, body);
      res.status(201).send({ new_comment: result });
    }
  } catch (err) {
    next(err);
  }
};
