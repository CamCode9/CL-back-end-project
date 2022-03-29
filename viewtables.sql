\c nc_news_test
-- SELECT * FROM articles;
-- SELECT * FROM comments;
-- SELECT * FROM topics;
-- SELECT * FROM users;


-- SELECT COUNT(comment_id) AS comment_count FROM comments WHERE comments.article_id = 1

SELECT COUNT(comment_id) AS comment_count FROM comments LEFT JOIN articles ON articles.article_id = comments.article_id WHERE comments.article_id = 1;