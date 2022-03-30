const db = require("../db/connection");
const { checkExists } = require("../db/helpers/utils");

exports.selectArticlesById = async (article_id) => {
  let articleQuery = `SELECT * FROM articles`;
  let result;

  if (!article_id) {
    articleQuery += ` ORDER BY created_at DESC;`;
    result = await db.query(articleQuery);
  } else {
    articleQuery += ` WHERE article_id = $1;`;
    result = await db.query(articleQuery, [article_id]);
  }

  for (const row of result.rows) {
    let id = row.article_id;
    const comment = await db.query(
      `SELECT COUNT(comment_id) AS count FROM comments WHERE comments.article_id = $1;`,
      [id]
    );
    const comment_count = Number(comment.rows[0].count);
    row.comment_count = comment_count;
  }

  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Article not found" });
  } else {
    return result.rows;
  }
};

exports.updateArticleVoteById = async (article_id, voteInc) => {
  if (!voteInc) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: missing vote increment",
    });
  }

  result = await db.query(
    `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
    [voteInc, article_id]
  );
  return result.rows[0];
};

exports.selectCommentsByArticle = async (article_id) => {
  let commentQuery = `SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1;`;
  const commentArray = await db.query(commentQuery, [article_id]);
  return commentArray.rows;
};

exports.sendComment = async (article_id, author, body) => {
  if (typeof body != "string" || typeof author != "string") {
    return Promise.reject({ status: 400, msg: "Invalid data type" });
  } else {
    const userExists = await checkExists("users", "username", author);
    if (userExists) {
      const postQuery = `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`;
      const new_comment = await db.query(postQuery, [article_id, author, body]);
      return new_comment.rows[0];
    }
  }
};
