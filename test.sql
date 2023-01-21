\c nc_news_test

SELECT
   articles.article_id, 
   articles.title,
    articles.topic, 
  articles.author, 
  articles.body, 
  articles.created_at,
   articles.votes, 
  articles.article_img_url,  
  COUNT(comments.body) AS comment_count
  FROM articles
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = 1
  GROUP BY articles.article_id ;
  


-- SELECT
--    articles.article_id, 
--    articles.title,
--     articles.topic, 
--   articles.author, 
--   articles.body, 
--   articles.created_at,
--    articles.votes, 
--   articles.article_img_url,  
--   COUNT(comments.body) AS comment_count
--   FROM articles
--   LEFT JOIN comments 
--   ON articles.article_id = comments.article_id  
--   WHERE topic = 'mitch'
--   GROUP BY articles.article_id  
--   ORDER BY articles.created_at DESC;