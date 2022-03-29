const db = require("../db/connection");

exports.selectArticlesById = async (article_id) => {
  let articleQuery = `SELECT * FROM articles`;
  let result;

  if (!article_id) {
    result = await db.query(articleQuery);
  } else {
    articleQuery += ` WHERE article_id = $1;`;
    result = await db.query(articleQuery, [article_id]);
  }

  const comment = await db.query(
    `SELECT COUNT(comment_id) AS count FROM comments WHERE comments.article_id = $1;`,
    [article_id]
  );

  const comment_count = Number(comment.rows[0].count);
  console.log(comment_count);

  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Article not found" });
  } else {
    console.log("FUFUFUFUFUFUFUF");
    result.rows[0].comment_count = comment_count;
    return result.rows[0];
  }
};
