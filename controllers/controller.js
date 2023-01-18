const {fetchTopics, fetchArticles, fetchArticlesById, fetchCommentsByArticleId} = require('../models/model');

const getTopics = (req, res, next) => {
  fetchTopics()
    .then((result) => { 
      res.status(200).send(result);
    })
    .catch(next);
};



const getArticles = (req, res, next) => { 
 
  fetchArticles(req)
  .then((results) => {   
     
      res.status(200).send(results)
  })
  .catch(next)
  
}
const getArticlesById = (req, res, next) => { 
  const {article_id} = req.params;

  
  fetchArticlesById(article_id)
  .then((result) => { 
      res.status(200).send(result);
    })
  .catch((err)=>{
next(err)
  });
};

const getCommentsByArticleId = (req, res, next) => { 
  const {article_id} = req.params;
  
  fetchCommentsByArticleId(article_id).then((result) => { 
    res.status(200).send(result);
  })
  .catch(next)  
}

module.exports = { getTopics, getArticles, getArticlesById, getCommentsByArticleId };
