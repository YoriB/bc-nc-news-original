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
    return Promise.reject({ status: 404, msg: 'Article not found' });
  }

  return db
    .query(`SELECT * 
    FROM articles 
    WHERE article_id = $1`, [article_id])

    .then((result) => {
      return result.rows[0];
    });
};


const fetchCommentsByArticleId= (article_id) =>{
  
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0){
        return Promise.reject({status: 404, msg: "Not found"});
      } else{
      return result.rows;
      }
    })
  }
    

  const fetchPostedCommentsByArticleId = (article_id, {username, body}) => {     

  if (!article_id ||!username ||!body) {
    return Promise.reject({ status: 400, msg: 'Incomplete comment' });
  } 

  else{   
    return db.query(`INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`, [article_id, username, body])
    .then((result) => { 
     
        return result.rows[0]    
  })
}
  }

const fetchVotedArticlesById = (article_id, votes) => {
if (typeof votes !== 'number') {
    return Promise.reject({ status: 400, msg: 'Invalid article_id -- must be an integer' });
  }   
  return db.query(`UPDATE articles 
  SET votes = votes + $1 
  WHERE article_id = $2 RETURNING * ;`
  , [article_id, votes])
.then((result) => { 
 
  return result.rows[0]  

})
}

const fetchUsers = () => {
  return db.query(`SELECT * FROM users; `).then((result) => {
    
    return result.rows;
  })
}

const fetchArticlesQueries = () => {
  return db.query().then((result) => {
    console.log(result);
    return result.rows;
})
}



module.exports = {
  fetchTopics,
  fetchArticles,
  fetchArticlesById,
  fetchCommentsByArticleId,
  fetchPostedCommentsByArticleId,
  fetchVotedArticlesById,
  fetchUsers,
  fetchArticlesQueries
};
