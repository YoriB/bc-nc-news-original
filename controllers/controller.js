const {fetchTopics} = require('../models/model');

const getTopics = (req, res, next) => {
  //const topics = req.query;

  fetchTopics()
    .then((result) => {
 
      res.status(200).send(result);
    })
    .catch(next);
};

module.exports = { getTopics };
