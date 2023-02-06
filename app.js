const cors = require('cors')
const express = require('express');


const {
  getTopics,
  getArticles,
  getArticlesById,
  getCommentsByArticleId,
  postCommentsByArticleId,
  updateArticle,
} = require('./controllers/controller');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticlesById);

app.get('/api/comments/:article_id', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postCommentsByArticleId);

app.patch('/api/articles/:article_id', updateArticle);

app.use((err, req, res, next) => { 

  if (err.status && err.msg) {   
     

   res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
 


  if (err.code == "22P02") {
    res.status(400).send({ msg: 'Bad request' });
  
  }
  else if(err.code ==='23503'){
    res.status(404).send({ msg: 'Not found' });
  } else {

    next(err);
  }
});

app.use((err, req, res, next) => {
 
  res.status(500).send({ msg: 'Internal Server Error' });
});

module.exports = { app };
