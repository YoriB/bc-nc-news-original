

##
3) To successfully connect the databases locally we need to create two files using the .env.example as a template. Write PGDATABASE = nc-news and nc-news-test respectively for the development and test databases.

Responds with:

an array of topic objects, each of which should have the following properties:
slug
description
As this is the first endpoint you will need to set up your testing suite.

Errors handled.


4) an articles array of article objects, each of which should have the following properties:

author

title

article_id

topic

created_at

votes

article_img_url

comment_count which is the total count of all the comments with this article_id - you should make use of queries to the database in order to achieve this.

the articles should be sorted by date in descending order.