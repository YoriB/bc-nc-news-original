Getting started
### Prerequisites:
- **Node** (download [here](https://nodejs.org/en/))
- **Git** (download [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git))
- **PostgreSQL** (download [here](https://www.postgresql.org/download/))
- **API Testing tool** (Supertest, Jest, Insomnia, Postman etc)

### Installation:
1. Clone this repository

```bash
git clone https://github.com/YoriB/bc-nc-news-original
```

2. `cd` into the repository
```bash
cd bc-nc-news-original
`3. Install all dependencies
```bash
npm install
```

4. Create a knexfile.js file in the root directory with the following code:
```js
const {Pool} = require(‘path’)
const ENV = process.env.NODE_ENV || "development";

const config = {
client: "pg",
migrations: {
directory: "./db/migrations",
},
seeds: {
directory: "./db/seeds",
},
};

development: {
connection: {
database: "nc_news",
// if you are using a Linux, enter your username and password here
// username: 'yourUsername'
// password: 'yourPassword'
},
},
test: {
connection: {
database: "nc_news_test",
// if you are using a Linux, enter your username and password here
// username: 'yourUsername'
// password: 'yourPassword'
},
},


module.exports = { db : new Pool(config)};
```

4. Database will require seeding - please follow these steps:

```bash
npm run setup-dbs
npm run seed
```

## Routes:

```http
GET /api/topics
GET /api/articles
GET /api/articles/:article_id
GET /api/articles/:article_id/comments
PATCH /api/articles/:article_id
POST /api/articles/:article_id/comments
GET /api/users
DELETE /api/comments/:comment_id
GET /api
```

## Test Suite:

**bc-nc-news-original** has a suite of tests that have been used to check the functionality of endpoints of the server, error handling and any utility functions that were used to seed the data. The scripts are already present in this repository. Please follow the command below to run tests:

```bash
npm test```

## Built with:

- [Express](https://expressjs.com/) - Node.js web application framework
- [Knex](http://knexjs.org/) - SQL query builder
- [PostgreSQL](https://www.postgresql.org/) - open source database
    • 