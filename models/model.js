const { db } = require("../db/connection");
const format = require("pg-format");
const topics = require("../db/data/development-data/topics");
const testData = require("../db/data/test-data/index");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result.rows;
  });
};

const fetchArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const queryValues = [];
  const acceptedSortBy = [
    "article_id",
    "article_img_url",
    "created_at",
    "title",
    "topic",
    "author",
    "votes",
    "body",
  ];
  const acceptedOrders = ['ASC', 'DESC'];
  order = order.toUpperCase();

  if (!acceptedOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }
  if (!acceptedSortBy.includes(sort_by)) {
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

  if (topic) {
    queryStr += ` WHERE topic = $1`;
    queryValues.push(topic);
  }
  queryStr += ` GROUP BY articles.article_id  ORDER BY ${sort_by} ${order};`;

  return db.query(queryStr, queryValues).then((results) => {
    if (results.rowCount === 0) {
      return Promise.reject({ status: 404, msg: 'Not found' });
    }

    return results.rows;
  });
};

const fetchArticlesById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      } else {
        let finalObj = {};

        for (let i = 0; i < result.rows.length; i++) {
          Object.assign(finalObj, result.rows[i]);
        }

        return finalObj;
      }
    });
};

const fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return result.rows;
      }
    });
};

const fetchPostedCommentsByArticleId = (article_id, { username, body }) => {
  if (!article_id || !username || !body) {
    return Promise.reject({ status: 400, msg: "Incomplete comment" });
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
        return Promise.reject({ status: 404, msg: "Not found" });
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

  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 `, [comment_id])
    .then((result) => {
      return result.rows;
    });
};

module.exports = {
  fetchTopics,
  fetchArticles,
  fetchArticlesById,
  fetchCommentsByArticleId,
  fetchPostedCommentsByArticleId,
  fetchVotedArticlesById,
  fetchUsers,
  deleteCommentById,
};
