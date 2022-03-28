const db = require("../db/connection");

exports.selectAllArticles = async (article_id) => {
  const result = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );
  if (!result.rows[0]) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  } else {
    return result.rows[0];
  }
};
