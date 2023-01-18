\c nc_news_test


SELECT * FROM articles



--  const queryString = `SELECT 
--   articles.author, 
--   articles.title, 
--   articles.article_id, 
--   articles.created_at, 
--   articles.votes, 
--   article_img_url,
--   COUNT(comments.article_id) AS comment_count
--   FROM articles
--   LEFT JOIN comments
--   ON articles.article_id = comments.article_id
--   GROUP BY articles.article_id
--   ORDER BY created_at DESC;`


-- "jest": {
--     "setupFilesAfterEnv": [
--       "jest-extended/all",
--       "jest-sorted"
--     ]