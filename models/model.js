const { db } = require('../db/connection');
//const format = require('pg-format');
const topics = require('../db/data/development-data/topics');

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics` )
    .then((result) => {  
      return result.rows;
    });
};



 


module.exports = {fetchTopics, fetchArticles};
