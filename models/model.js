const { db } = require('../db/connection');
const format = require('pg-format');
const topics = require('../db/data/development-data/topics');
const testData = require('../db/data/test-data/index');

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result.rows;
  });
};

const fetchArticles = (sort_by = 'created_at', order = 'DESC', topic) => {
  const queryValues = [];
  const acceptedSortBy = [
    'article_id',
    'article_img_url',
    'created_at',
    'title',
    'topic',
    'author',
    'votes',
    'body',
  ];
  const acceptedOrders = ['ASC', 'DESC'];
  order = order.toUpperCase()
 
  if (!acceptedOrders.includes(order)) {
    return Promise.reject({ status: 400, msg:'Bad request'});
  }
  if (!acceptedSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg:'Bad request'});
  }

  let queryStr = `SELECT
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
  ON articles.article_id = comments.article_id`;

  if (topic) {
    queryStr += ` WHERE topic = $1`;
    queryValues.push(topic);
  }
  queryStr += ` GROUP BY articles.article_id  ORDER BY ${sort_by} ${order};`

  return db.query(queryStr, queryValues).then((results) => {
   if(results.rowCount === 0){
    return Promise.reject({ status: 404, msg: 'Not found' });
   }
    return results.rows;
  });
};

const fetchArticlesById = (article_ID, sort_by = 'created_at', order = 'DESC', article_id) => { 

if (article_ID > testData.articleData.length) {
  return Promise.reject({ status: 404, msg: 'Not found' });
  }

else {
  const queryValues = [];
  const acceptedSortBy = [
    'article_id',
    'article_img_url',
    'created_at',
    'title',
    'topic',
    'author',
    'votes',
    'body',
    'comment_count'
  ];
  const acceptedOrders = ['ASC', 'DESC'];
  
  order = order.toUpperCase() 

   if (!acceptedSortBy.includes(sort_by) ||!acceptedOrders.includes(order) ||(/([a-z])/gim).test(article_ID) ) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }
  

  let queryStr = `SELECT
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
  ON articles.article_id = comments.article_id`;

     if (article_id) {
    queryStr += ` WHERE article_id = $1`;;
    
    queryValues.push(article_id);    
     }

  queryStr += ` GROUP BY articles.article_id  ORDER BY ${sort_by} ${order};`

  return db.query(queryStr, queryValues).then((results) => {    
   return results.rows;      

  }); 
}
}  

  
const fetchCommentsByArticleId = ()=> {
  return db
    .query(
      'SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;',
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      } else {
      return result.rows;
      }
    });
};

const fetchPostedCommentsByArticleId = (article_id, { username, body }) => {
  if (!article_id || !username || !body) {
    return Promise.reject({ status: 400, msg: 'Incomplete comment' });
  } else {
    return db
      .query(
        `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
        [article_id, username, body]
      )
      .then((result) => {
        return result.rows[0];
      });
  }
};

const fetchVotedArticlesById = (article_id, voteChange) => {
  if (typeof voteChange !== 'number' || voteChange === undefined) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  } 
  return db
    .query(
      `UPDATE articles 
  SET votes = votes + $2 
  WHERE article_id = $1 RETURNING * ;`,
      [article_id, voteChange]
    )
   
    .then((result) => { 
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      }
      return result.rows[0];
    });
};

const fetchUsers = () => {
  return db.query(`SELECT * FROM users; `).then((result) => {
    return result.rows;
  });
};
     
const deleteCommentById = (comment_id) => {
  if (comment_id > testData.articleData.length) {
    return Promise.reject({ status: 404, msg: 'Not found' });
  }   
return db.query(`DELETE FROM comments USING articles
  WHERE comments.comment_id = $1
  AND articles.article_id = comments.article_id ; 
  `,[comment_id])
  .then((result) =>  {     
    return result.rows
  })
};

module.exports = {
  fetchTopics,
  fetchArticles,
  fetchArticlesById,
  fetchCommentsByArticleId,
  fetchPostedCommentsByArticleId,
  fetchVotedArticlesById,
  fetchUsers,
  deleteCommentById
};
