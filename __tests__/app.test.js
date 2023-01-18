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
  describe('GET /api/topics', () => {
    test('should return a status :200 and return a body of three objects containing topics(properties) ', () => {
      return request(app)
        .get('/api/topics')
        .then(({ body }) => {
          expect(body.length).toEqual(3);
          body.forEach((topic) => {
            expect(topic).toHaveProperty('slug');
            expect(topic).toHaveProperty('description');
          });
        });
    });
  });

  describe('GET /api/articles', () => {
    test('should return a status :200 and return a body containing an array of objects tested to show all its properties', () => {
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
  
  describe('GET /api/articles/:article_id', () => {
    test('should return a status :200 and responds with an articles object with required keys', () => {
      return request(app)
        .get('/api/articles/2')
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
          })      
      test('should return an object with a length of 1', () => {
        return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then(({ body }) => {    
         
         for (let i = 0; i < body.length; i++) { 
          expect(body[i].length).toEqual(1);  
         }
         })   
        })    
 
test('404 status response with a valid path but non existent article', () => {
  return request(app)
  .get('/api/articles/55')
  .expect(404)
  .then(({body})=> {
   
    expect(body.msg).toEqual('Article not found');
})
})
test('400 status response with an  invalid article ID', () => {
  return request(app)
  .get('/api/articles/banaanaz')
  .expect(400)
  .then(({body})=> {
   
    expect(body.msg).toEqual('Bad request');
  })
 
})



// describe('GET /api/comments/articleId/count', () => {
//   test('should return a status :200 and return a body containing an array of objects for the comments with a particular article Id', () => {
//     return request(app)
//     .get('/api/comments/2/count')
//     .expect(200)
//     .then(({body}) => {
//       console.log(body)
//     })
//   })
// })
})
})
})

