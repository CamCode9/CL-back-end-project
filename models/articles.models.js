const db = require("../db/connection");

exports.selectArticlesById = async (article_id) => {
  const comment = await db.query(
    `SELECT COUNT(comment_id) AS count FROM comments WHERE comments.article_id = $1;`,
    [article_id]
  );
  const comment_count = Number(comment.rows[0].count);
  const result = await db.query(
    `SELECT * FROM articles WHERE article_id = $1;`,
    [article_id]
  );
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Article not found" });
  } else {
    result.rows[0].comment_count = comment_count;
    return result.rows[0];
  }
};
