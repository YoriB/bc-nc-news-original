##

3. To successfully connect the databases locally we need to create two files using the .env.example as a template. Write PGDATABASE = nc-news and nc-news-test respectively for the development and test databases.

Responds with:

an array of topic objects, each of which should have the following properties:
slug
description
As this is the first endpoint you will need to set up your testing suite.

Errors handled.

4. an articles array of article objects, each of which should have the following properties:

author

title

article_id

created_at

votes

article_img_url

comment_count which is the total count of all the comments with this article_id - you should make use of queries to the database in order to achieve this.

the articles should be sorted by date in descending order.

5. Responds with:

an article object, which should have the following properties:

author
title
article_id
body
topic
created_at
votes
article_img_url

-Error handling here

6. an array of comments for the given article_id of which each comment should have the following properties:

comment_id

votes

created_at

author

body

article_id

comments should be served with the most recent comments first

-Error handling here

7)Request body accepts:

an object with the following properties:
username
body
Responds with:

the posted comment

Error handling here

8. Request body accepts:

an object in the form { inc_votes: newVote }

newVote will indicate how much the votes property in the database should be updated by
e.g.

{ inc_votes : 1 } would increment the current article's vote property by 1

{ inc_votes : -100 } would decrement the current article's vote property by 100

Responds with:

the updated article

Error handling here

9.  Responds with:

an array of objects, each object should have the following property:
username
name
avatar_url

Error handling here


10.
topic, which filters the articles by the topic value specified in the query. If the query is omitted the endpoint should respond with all articles.

sort_by, which sorts the articles by any valid column (defaults to date)

order, which can be set to asc or desc for ascending or descending (defaults to descending)

error handling here

11)
An article response object should also now include:

-comment_count which is the total count of all the comments with this article_id - you should make use of queries to the database in order to achieve this.

error handling here

12)DELETE /api/comments/:comment_id
Should:

delete the given comment by comment_id
Responds with:

status 204 and no content

Error handling here