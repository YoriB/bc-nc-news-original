const { db } = require('../db/connection');
const format = require('pg-format');
const topics = require('../db/data/development-data/topics');
const testData = require('../db/data/test-data/index');

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result.rows;
  });
};

const fetchArticles = (req) => {
  console.log('hhhhhhhhh');
  let queryString = `SELECT
   articles.article_id, 
   articles.title,
    articles.topic, 
  articles.author, 
  articles.body, 
  articles.created_at,
   articles.votes, 
  articles.article_img_url,  
  COUNT(comments.body) AS comment_count
  FROM articles LEFT JOIN comments 
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id 
  ORDER BY articles.created_at DESC;`;

  return db.query(queryString).then((results) => {
    return results.rows;
  });
};

const fetchArticlesById = (article_id) => {
  if (article_id > testData.articleData.length) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }

  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])

    .then((result) => {
      return result.rows[0];
    });
};

const fetchCommentsByArticleId = (article_id) => {
  console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwww');
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [article_id])

    .then((result) => {
      return result.rows;
    });
};

module.exports = {
  fetchTopics,
  fetchArticles,
  fetchArticlesById,
  fetchCommentsByArticleId,
};
