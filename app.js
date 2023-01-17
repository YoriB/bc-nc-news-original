const express = require('express');

const { getTopics, getArticles } = require('./controllers/controller');
const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);


app.use((err, req, res, next) => {
  if (err.status) {
      res.status(err.status).send({msg: err.msg})
  } else {
      next(err)
  }
})


module.exports = { app };

