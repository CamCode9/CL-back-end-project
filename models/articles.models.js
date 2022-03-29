const db = require("../db/connection");

exports.selectArticlesById = async (article_id) => {
  const result = await db.query(
    `SELECT * FROM articles WHERE article_id = $1;`,
    [article_id]
  );
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Article not found" });
  } else {
    return result.rows[0];
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
