const request = require('supertest');
const { app } = require('../app');
const { db } = require('../db/connection');
const data = require('../db/data/test-data');
const toSort = require('jest-sorted');

const seed = require('../db/seeds/seed');

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe('app', () => {
  describe.only('GET /api/topics', () => {
    test('should return a status :200 and return a body of three objects containing topics(properties) ', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toEqual(3);
          body.forEach((topic) => {
            expect(topic).toHaveProperty('slug');
            expect(topic).toHaveProperty('description');
          });
        });
    });
  });
});

describe('GET /api/articles', () => {
  test.only('should return a status :200 and return a body containing an array of objects tested to show all its properties', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toEqual(12);
        body.forEach((article) => {
        
          expect(article).toHaveProperty('author');
          expect(article).toHaveProperty('title');
          expect(article).toHaveProperty('article_id');
          expect(article).toHaveProperty('created_at');
          expect(article).toHaveProperty('votes');
          expect(article).toHaveProperty('article_img_url');
          expect(article).toHaveProperty('comment_count');
        });
      });
  });
  test('return a body ordered in a descending order with created_at as the criteria', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy('created_at', {
          descending: true,
        });
      });
  });
});

describe('GET /api/articles/:article_id', () => {
  test('should return a status :200 and responds with an articles object with all the required keys', () => {
    const article_id = 9 ;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body }) => {  
        
           
          expect(body).toHaveProperty('author'), expect.any(String);
          expect(body).toHaveProperty('title'), expect.any(String);
          expect(body).toHaveProperty('article_id'), expect.any(Number);
          expect(body).toHaveProperty('body'), expect.any(String);
          expect(body).toHaveProperty('topic'), expect.any(String);
          expect(body).toHaveProperty('created_at'), expect.any(String);
          expect(body).toHaveProperty('votes'), expect.any(Number);
          expect(body).toHaveProperty('article_img_url'), expect.any(String);
      
      });
  });

  test('should return a single object with the expected article_id and the total comment_count', () => {
    const article_id = 4;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body }) => {
        for (let i = 0; i < body.length; i++) {
          if (body[i].article_id === article_id) {
            expect(body[i].article_id).toEqual(4);
            expect(body[i].title).toEqual('Student SUES Mitch!');
            expect(body[i].topic).toEqual('mitch');
            expect(body[i].author).toEqual('rogersop');
            expect(body[i].body).toEqual(
              'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages'
            );
            expect(body[i].created_at).toEqual('2020-05-06T01:14:00.000Z');
            expect(body[i].votes).toEqual(0);
            expect(body[i].article_img_url).toEqual(
              'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            );
          }
        }
      });
  });

  test('404 status response with a valid path but non existent article', () => {
    const article_id = 55;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual('Not found');
      });
  });

  test('400 status response with an  invalid article ID', () => {
    const article_id = 'banannanaz';
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual('Bad request');
      });
  });

  describe('GET /api/comments/:article_id', () => {
    test('should return a status :200 and return a body containing an array of objects for the comments with a particular article Id', () => {
      const article_id = 3;
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toEqual(2);
        });
    });

    test('returns an array of comments for the given article_id', () => {
      const article_id = 1;
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .then(({ body }) => {
          expect(body.length).toEqual(11);
          body.forEach((comment) => {
            expect(comment).toHaveProperty('comment_id');
            expect(comment).toHaveProperty('body');
            expect(comment).toHaveProperty('author');
            expect(comment).toHaveProperty('created_at');
            expect(comment).toHaveProperty('article_id');
            expect(comment).toHaveProperty('votes');
          });
        });
    });
    test('return a body of comments with the most recent first using created_at as the criteria', () => {
      const article_id = 1;
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .then(({ body }) => {
          expect(body).toBeSortedBy('created_at', {
            descending: true,
          });
        });
    });

    test('404 status response with a valid path but non existent article id', () => {
      return request(app)
        .get('/api/articles/55/comments')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual('Not found');
        });
    });

    test('400 status response with an  invalid article ID', () => {
      return request(app)
        .get('/api/articles/banaanaz/comments')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual('Bad request');
        });
    });
  });

  describe('POST /api/articles/:article_id/comments', () => {
    test('should return a status :201 when a valid comment is posted and checks its length', () => {
      const newComment = { username: 'icellusedkars', body: 'test' };
      return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          for (let i = 0; i < body.length; i++) {
            expect(body.length).toEqual(1);
          }
        });
    });
    test('should return a body containing the username, body and article_id when a valid comment is posted', () => {
      const newComment = { username: 'icellusedkars', body: 'test' };
      return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .then(({ body }) => {
          for (let i = 0; i < body.length; i++) {
            expect(body[i]).toEqual({ ...newComment_ });
          }
        });
    });
    test('should return a status of 400 for a missing body', () => {
      const newComment = { username: 'icellusedkars' };
      return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual('Incomplete comment');
        });
    });

    test('should return a status of 400 for a missing username', () => {
      const newComment = { body: 'test' };
      return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual('Incomplete comment');
        });
    });

    test('400 status response with a non existent article id', () => {
      const newComment = { username: 'icellusedkars', body: 'test' };
      return request(app)
        .post('/api/articles/cheese/comments')
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual('Bad request');
        });
    });

    test('404 status response with a valid path but non existent article id', () => {
      const newComment = { username: 'icellusedkars', body: 'test' };
      return request(app)
        .post('/api/articles/99786954/comments')
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual('Not found');
        });
    });
  });

  describe('PATCH /api/articles/:article_id', () => {
    test('should return a status :200 and return a body with an updated increased number of votes', () => {
      const newVote = 10;
      const articleVoted = { inc_votes: newVote };
      return request(app)
        .patch(`/api/articles/1`)
        .send(articleVoted)
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 110,
            article_img_url:
              'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
          });
        });
    });
    test('should return a status :200 and return a body with an updated decreased number of votes', () => {
      const newVote = -110;
      const articleVoted = { inc_votes: newVote };
      return request(app)
        .patch(`/api/articles/1`)
        .send(articleVoted)
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: -10,
            article_img_url:
              'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
          });
        });
    });

    test('PATCH - returns a status 400 and an incorrect input message when the value of inc_votes is a format another than a number', () => {
      const newVote = 'dog';
      const articleVoted = { inc_votes: newVote };
      return request(app)
        .patch('/api/articles/4')
        .send(articleVoted)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual('Bad request');
        });
    });

    test('PATCH - returns a status 400 and an incorrect input message when the key value is not inc_votes', () => {
      const newVote = 1;
      const articleVoted = { cheese: newVote };
      return request(app)
        .patch('/api/articles/3')
        .send(articleVoted)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual('Bad request');
        });
    });

    test('404 status response with a valid path but non existent article', () => {
      const newVote = 1;
      const articleVoted = { inc_votes: newVote };
      return request(app)
        .patch('/api/articles/3556')
        .send(articleVoted)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual('Not found');
        });
    });

    test('PATCH - returns a status 200 and the updated article, even when there is more than one property on the request body', () => {
      const newVote = 1;
      const articleVoted = { inc_votes: newVote, name: 'Emad' };
      return request(app)
        .patch('/api/articles/1')
        .send(articleVoted)
        .expect(200)
        .then(({ body }) => {
          for (let i = 0; i < body.length; i++) {
            expect(body[i]).toEqual(101);
          }
        });
    });
  });

  describe('GET /api/users', () => {
    test('should return a status :200 and return an array of users', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body)).toBe(true);
          body.forEach((user) => {
            expect(user).toHaveProperty('username');
            expect(user).toHaveProperty('name');
            expect(user).toHaveProperty('avatar_url');
          });
        });
    });
  });

  describe('PATCH /api/articles/:article_id', () => {
    test('should return a status :200 and return a body with an updated increased number of votes', () => {
      const newVote = 10;
      const articleVotes = { inc_votes: newVote };
      return request(app)
        .patch(`/api/articles/1`)
        .send(articleVotes)
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 110,
            article_img_url:
              'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
          });
        });
    });

    test('should return a status :200 and return a body with an updated decreased number of votes', () => {
      const newVote = -110;
      const articleVotes = { inc_votes: newVote };
      return request(app)
        .patch(`/api/articles/1`)
        .send(articleVotes)
        .expect(200)
        .then(({ body }) => {
          console.log(body)
          expect(body).toEqual({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: -10,
            article_img_url:
              'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
          });
        });
    });

    test('PATCH - returns a status 400 and a bad request message when missing the inc_votes key', () => {
      const newVote = 12;
      const articleVotes = { crisps: newVote };
      return request(app)
        .patch('/api/articles/4')
        .send(articleVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual('Bad request');
        });
    });

    test('PATCH - returns a status 400 and an incorrect input message when the value of inc_votes is a format another than a number', () => {
      const newVote = 'dog';
      const articleVotes = { inc_votes: newVote };
      return request(app)
        .patch('/api/articles/4')
        .send(articleVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual('Bad request');
        });
    });

    test('PATCH - returns a status 404 and for an article that does not exist', () => {
      const newVote = 1;
      const articleVotes = { inc_votes: newVote };
      return request(app)
        .patch('/api/articles/467')
        .send(articleVotes)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual('Not found');
        });
    });

    test('PATCH - returns a status 200 and the updated article, even when there is more than one property on the request body', () => {
      const newVote = 1;
      const articleVotes = { inc_votes: newVote, name: 'Emad' };
      return request(app)
        .patch('/api/articles/1')
        .send(articleVotes)
        .expect(200)
        .then(({ body }) => {
          expect(body.votes).toEqual(101);
        });
    });
  });
});
describe('GET /api/articles', () => {
  test('should return a status :200 and return a body containing articles to be queried', () => {
    return request(app)
      .get('/api/articles?topic=mitch')
      .expect(200)
      .then(({ body }) => {
        body.forEach((article) => {
          expect(article.topic).toEqual('mitch');
        });
      });
  });
  test('should return a status 404 for a bad topic query', () => {
    return request(app)
      .get('/api/articles?topic=orangeee')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual('Not found');
      });
  });
  test('Accepts a query to change sort by', () => {
    return request(app)
      .get('/api/articles?sort_by=created_at')
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy('created_at', {
          descending: true,
        });
      });
  });
  test('Returns status 400 for bad sort by request', () => {
    return request(app)
      .get('/api/articles?sort_by=bananazzz')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual('Bad request');
      });
  });
  test('Accepts an order query to change sort order', () => {
    return request(app)
      .get('/api/articles?order=desc')
      .expect(200)
      .then(({ body }) => {
        for (let i = 1; i < body.length; i++) {
          let isLessThan = false;
          if (body[i].created_at <= body[i - 1].created_at) isLessThan = true;
          expect(isLessThan).toEqual(true);
        }
      });
  });
});

describe(' GET /api/articles/:article_id (comment count),', () => {
  test('should return a status :200 and return the total count with this article_id via a query', () => {
    const article_id = 3;
    return request(app)
      .get(`/api/articles/${article_id}?comment_count = count`)
      .expect(200)
      .then(({ body }) => {
        for (let i = 0; i < body.length; i++) {
          if (body[i].article_id === article_id) {
            expect(+body[i].comment_count).toEqual(2);
          }
        }
      });
  });
});

describe('DELETE api/comments/${comment_id}', () => {
  test.only('should return a status :204 and delete the article with the specified comment_id', () => {
    const comment_id = 7;
    return request(app)
    .delete(`/api/comments/${comment_id}`)
    .expect(204);
  });
 
});
