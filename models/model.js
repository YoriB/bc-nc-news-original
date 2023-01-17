const { db } = require('../db/connection');
//const format = require('pg-format');
const topics = require('../db/data/development-data/topics');

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics` )
    .then((result) => {  
      return result.rows;
    });
};


const fetchArticles = ( sort_by = "created_at", order = "DESC", comment_count ) => {
  const queryValues = [];
  const acceptedSortBy = ["created_at"]
  order = order.toUpperCase()
  const acceptedOrders = [ 'ASC', 'DESC']

  let queryStr = `SELECT articles.article_id, articles.author, articles.title,  articles.topic, articles.created_at, articles.article_img_url FROM articles`


  if (colour) {
      queryStr += `WHERE colour = $1`
      queryValues.push(colour)
  }

  queryStr += `ORDER BY ${sort_by} ${order};`

  if (!acceptedSortBy.includes(sort_by)) {
      return Promise.reject({ status: 400, msg: 'Bad request'})
  }

  if (!acceptedOrders.includes(order)) {
      return Promise.reject({ status: 400, msg: 'Bad request'})
  }

  return db.query(queryStr, queryValues)

  .then(results => {
    
      if (results.rows.length === 0) {
          return Promise.reject({ status: 404, msg: 'Not found'})
      }

      return results.rows
  })
}


module.exports = { fetchTopics, fetchArticles};
