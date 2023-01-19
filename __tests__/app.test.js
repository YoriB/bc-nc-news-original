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



describe('GET /api/comments/:article_id', () => {
 
  test('should return a status :200 and return a body containing an array of objects for the comments with a particular article Id', () => {
    const article_id = 3;
    return request(app)
    .get(`/api/comments/${article_id}`)
    .expect(200)
    .then(({body}) => {       
     expect(body.length).toEqual(2);    
  })
})

test('returns an array of comments for the given article_id', () => {
  const article_id = 1;
  return request(app)
  .get(`/api/comments/${article_id}`)
  .then(({body}) => {
    expect(body.length).toEqual(11);   
    body.forEach((comment) => {
      expect(comment).toHaveProperty('comment_id');
      expect(comment).toHaveProperty('body');
      expect(comment).toHaveProperty('author');
      expect(comment).toHaveProperty('created_at');
      expect(comment).toHaveProperty('article_id');
      expect(comment).toHaveProperty('votes');   
    });
  })  
})
test('return a body of comments with the most recent first using created_at as the criteria', () => {
  const article_id = 1;
  return request(app)
  .get(`/api/comments/${article_id}`)    
    .then(({ body }) => {  
       
        expect(body).toBeSortedBy('created_at', {
          descending: true,
        });          
    });
});
 
test('404 status response with a valid path but non existent article id', () => {
  return request(app)
  .get('/api/comments/55')
  .expect(404)
  .then(({body})=> {   
    expect(body.msg).toEqual('Not found');
})
})

  
  test('400 status response with an  invalid article ID', () => {
    return request(app)
    .get('/api/comments/banaanaz')
    .expect(400)
    .then(({body})=> {     
      expect(body.msg).toEqual('Bad request');
    })   
  })
  }) 
  

  describe('POST /api/articles/:article_id/comments', () => {
    test('should return a status :201 when a valid comment is posted and checks its length',() => {     
   
  const newComment = {article_id : 1, username: 'icellusedkars',body: "test"}
      return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({body}) => {      
        for (let i = 0; i < body.length; i++) {           
        expect(body.length).toEqual(1);  
        }     
  })
})
test('should return a body containing the username, body and article_id when a valid comment is posted',() => {
  const newComment = {article_id : 1, username: 'icellusedkars',body: "test"}
  return request(app)
  .post("/api/articles/1/comments")
  .send(newComment)  
  .then(({body}) => { 
    for (let i = 0; i < body.length; i++) { 
   expect(body[i]).toEqual({...newComment_}); 
    } 
  }) 
})
test('should return a status of 400 for a missing username',() => {
  const newComment = {article_id : 1, username: 'icellusedkars'}  
  return request(app)
  .post("/api/articles/1/comments")
  .send(newComment)
  .expect(400)
  .then(({body})=> {
    expect(body.msg).toEqual('Incomplete comment');
})
}) 

  test('should return a status of 400 for a missing key value',() => {
    const newComment = {article_id : 1, username: 'icellusedkars'}  
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(400)
    .then(({body})=> {
      expect(body.msg).toEqual('Incomplete comment');
    })
  })   

// test('404 status response with a non existent article id', () => {
//   const newComment = { article_id : 'cheese', username: 'icellusedkars', body : 'test'}    
//     return request(app)
//     .post('/api/articles/cheese/comments')
//     .send(newComment)
//     .expect(404)
//     .then(({body})=> {  
//   expect(body.msg).toEqual('Not found');
//     })
//   })
  })  
})
  

//   describe.only('PATCH  /api/articles/:article_id ', () => {
//     test('should return a status :200 when a valid comment is updated.', () => {
//       const newVote = 1
//       const articleVoted = {inc_votes : newVote}
//       return request(app)
//       .patch(" /api/articles/1")
//       .send(articleVoted)
//       .expect(200)
//       .then(({body}) => {
//         return body;
//         })
// })
//   })
})
})





