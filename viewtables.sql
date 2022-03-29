\c nc_news_test
-- SELECT * FROM articles;
-- SELECT * FROM comments;
-- SELECT * FROM topics;
-- SELECT * FROM users;


-- SELECT COUNT(comment_id) AS comment_count FROM comments WHERE comments.article_id = 1

SELECT * FROM articles WHERE article_id = 1 ORDER BY created_at;