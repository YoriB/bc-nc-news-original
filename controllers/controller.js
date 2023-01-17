const {fetchTopics, fetchArticles} = require('../models/model');

const getTopics = (req, res, next) => {
  fetchTopics()
    .then((result) => {
 
      res.status(200).send(result);
    })
    .catch(next);
};



const getArticles = (req, res, next) => {
  
  const { sort_by, order, comment_count } = req.query
  fetchArticles( sort_by, order, comment_count)
  .then((result) => {
      
      res.status(200).send(result)
  })
  .catch(next)
  
}

module.exports = { getTopics, getArticles };
