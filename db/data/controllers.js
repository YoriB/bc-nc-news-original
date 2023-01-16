const fetchTopics = require('./models');
const getTopics = (req, res, next) => {
  const topics = req.query;
  fetchTopics(topics)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch(next);
};

module.exports = { getTopics };
