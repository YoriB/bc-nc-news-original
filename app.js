const express = require('express');

const { getTopics, getArticles, getArticlesById , getCommentsByArticleId} = require('./controllers/controller');
const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticlesById);

app.get('/api/comments/:articleId/count', getCommentsByArticleId);



app.use((err, req, res, next) => {
  if (err.status) {
   
      res.status(err.status).send({msg: err.msg})
  } else {
      next(err)
  }
})

app.use((err, req, res, next) => {
  console.log(err)
  if (err.code === '22P02') {
      response.status(400).send({msg: 'Bad request'})
  } else {
      next(err)
  }
})

app.use((err, req, res, next) => {
  
  res.status(500).send({msg: 'Internal Server Error'})
})


module.exports = { app };

