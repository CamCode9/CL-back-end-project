const { checkExists } = require("../db/helpers/utils");
const {
  selectAllArticles,
  selectArticlesById,
  updateArticleVoteById,
  selectCommentsByArticle,
  sendComment,
  removeCommentById,
} = require("../models/articles.models");

exports.getArticlesById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const result = await selectArticlesById(article_id);
    res.status(200).send({ article: result[0] });
  } catch (err) {
    next(err);
  }
};

exports.getAllArticles = async (req, res, next) => {
  try {
    let { sort_by, order, topic } = req.query;
    const result = await selectArticlesById(null, sort_by, order, topic);
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

    let updatedArticle = await updateArticleVoteById(article_id, voteInc);
    res.status(200).send({ updatedArticle });
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

    let result = await selectCommentsByArticle(article_id);
    res.status(200).send({ comments: result });
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

    let result = await sendComment(article_id, author, body);
    res.status(201).send({ new_comment: result });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const commentExists = await checkExists(
      "comments",
      "comment_id",
      comment_id
    );

    let result = await removeCommentById(comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
