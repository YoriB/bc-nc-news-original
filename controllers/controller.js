const {fetchTopics, fetchArticles, fetchArticlesById, fetchCommentsByArticleId, fetchPostedCommentsByArticleId, fetchVotedArticlesById, fetchUsers, deleteCommentById} = require('../models/model');

const getTopics = (req, res, next) => {
  fetchTopics()
    .then((result) => { 
      res.status(200).send(result);
    })
    .catch(next)
};



const getArticles = (req, res, next) => { 
  const {sort_by, order, topic} = req.query;

 
  fetchArticles(sort_by, order, topic)
  .then((results) => {   
     
      res.status(200).send(results)
  
  })
  .catch(next)
}


const getArticlesById = (req, res, next) => { 

 
  const {sort_by, order, article_id} = req.query;

 const article_ID= req.params.article_id;



  
  fetchArticlesById(article_ID, sort_by, order, article_id)
  .then((result) => { 
    
      res.status(200).send(result);
    })
  .catch(next)
};

const getCommentsByArticleId = (req, res, next) => { 
  const {article_id} = req.params;
 
  fetchCommentsByArticleId(article_id).then((result) => {   
  
    res.status(200).send(result);
  })
  .catch(next)  
}

const postCommentsByArticleId = (req, res, next) => {  
  
  const comment = req.body
 const {article_id} = req.params;

  fetchPostedCommentsByArticleId(article_id, comment).then((result) => {  
  
    res.status(201).send(result);
  })
 
  .catch(next)  
}

const updateArticle = (req, res, next) => {

  const voteChange = req.body.inc_votes; 
const {article_id} = req.params;
   fetchVotedArticlesById(article_id, voteChange)
  .then((result) => { 
 
    res.status(200).send(result);
  })
  .catch(next)
}
  
 
const getUsers = (req, res, next) => {
  
  fetchUsers().then((result) => { 
  
    res.status(200).send(result);
  }).catch(next)
}

const deleteComment = (req, res, next) => {
  const comment_id = req.params.comment_id;


  deleteCommentById(comment_id).then((result) => {
    res.status(204).send(result);
  }).catch(next)
}


 
module.exports = { getTopics, getArticles, getArticlesById, getCommentsByArticleId , postCommentsByArticleId, updateArticle, getUsers, deleteComment};
