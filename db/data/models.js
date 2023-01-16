const { db } = require('./connection');
const format = require('pg-format');

const fetchTopics = () => {
  return db.query().then((results) => {
    return results.rows[0];
  });
};

module.exports = { fetchTopics };
