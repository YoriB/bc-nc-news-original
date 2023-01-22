\c nc_news_test


DELETE FROM comments USING articles
WHERE comments.comment_id = 1
AND articles.article_id =  comments.article_id 
RETURNING*; 
