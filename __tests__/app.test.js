const request = require('supertest');
const { app } = require('../app');
const { db } = require('../db/connection');
const data = require('../db/data/test-data');

const seed = require('../db/seeds/seed');

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe('app', () => {
  describe('GET /api/topics', () => {
    test('should return a status :200 ',() => {
      return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({body}) => {
        expect(true).toEqual(true);        
      });
    });
  })

    test('return an array with three topic objects ', () => {
      return request(app)
      .get('/api/topics')
      .then(({body}) => {      
          expect(body.length).toEqual(3);
        });
      });
    })

      test('return a body containing topics for slug and description', () => {
            return request(app)
            .get('/api/topics')
            .then(({body}) => {      
          body.forEach(topic => {
              expect(topic).toHaveProperty('slug')
              expect(topic).toHaveProperty('description')  
          })
        })
      })    
      
      describe('GET /api/articles', () => {
        test('should return a status :200 ',() => {
          return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({body}) => {
            expect(true).toEqual(true);        
          });
        });
      })

  test('return a body containing an array of objects with following properties', () => {
        return request(app)
        .get('/api/articles')
        .then(({body}) => {      
      body.forEach(article => {
          expect(article).toHaveProperty('author')
          expect(article).toHaveProperty('title')  
          expect(article).toHaveProperty('article_id') 
          expect(article).toHaveProperty('topic') 
          expect(article).toHaveProperty('created_at')  
          expect(article).toHaveProperty('votes') 
          expect(article).toHaveProperty('article_img_url')     
      })
    })
  })  