import express from 'express';
import asyncHandler from 'express-async-handler';

import fetch from 'node-fetch';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

app.use(express.json()); // It parses incoming requests with JSON payloads and is based on body-parser.

app.get(
  '/post',
  asyncHandler(async (req, res) => {
    const postResponse = await fetch(
      'https://jsonplaceholder.typicode.com/posts'
    );
    const postjson = await postResponse.json();
    const commentResponse = await fetch(
      'https://jsonplaceholder.typicode.com/comments'
    );
    const commentjson = await commentResponse.json();
    // Calculate the total_number_of_comments for each post
    let numOfCommentsObj = commentjson.reduce(function (allPost, comment) {
      if (comment['postId'] in allPost) {
        allPost[comment['postId']]++;
      } else {
        allPost[comment['postId']] = 1;
      }
      return allPost;
    }, {});

    // Reformatting Array of Post Object
    let mappedPosts = postjson.map((post) => {
      const newPost = {};

      newPost['post_id'] = post.id;
      newPost['post_title'] = post.title;
      newPost['post_body'] = post.body;
      newPost['total_number_of_comments'] = numOfCommentsObj[post.id];
      return newPost;
    });

    // Sort by descending order to show top posts with the most number of comments
    mappedPosts.sort(function (a, b) {
      return b['total_number_of_comments'] - a['total_number_of_comments'];
    });

    res.json(mappedPosts);
  })
);

app.get('/comments');

app.use(notFound);
app.use(errorHandler);

const PORT = 5000;
app.listen(PORT, console.log(`Server running at ${PORT}`));
