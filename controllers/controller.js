const {fetchTopics, fetchArticles} = require('../models/model');

const getTopics = (req, res, next) => {
  fetchTopics()
    .then((result) => { 
      res.status(200).send(result);
    })
    .catch(next);
};



const getArticles = (req, res, next) => { 
 
  fetchArticles()
  .then((result) => {      
      res.status(200).send(result)
  })
  .catch(next)
  
}

module.exports = { getTopics, getArticles };
