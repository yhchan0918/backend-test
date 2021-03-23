import express from 'express';
import asyncHandler from 'express-async-handler';
import fetch from 'node-fetch';

import { filterComments } from './utils/commentsFilters.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

app.use(express.json()); // It parses incoming requests with JSON payloads and is based on body-parser.
const POSTS_API_URL = 'https://jsonplaceholder.typicode.com/posts';
const COMMENTS_API_URL = 'https://jsonplaceholder.typicode.com/comments';

// @desc    Return a list of top posts ordered by the number of comment
// @route   GET /post
app.get(
  '/posts',
  asyncHandler(async (req, res) => {
    const postResponse = await fetch(POSTS_API_URL);
    const postjson = await postResponse.json();
    const commentResponse = await fetch(COMMENTS_API_URL);
    const commentjson = await commentResponse.json();
    // Calculate the total_number_of_comments for each post
    let numOfCommentsObj = calculateNumOfComments(commentjson);

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

    res.status(200).json(mappedPosts);
  })
);

// @desc    Return a list of comments based on filter
// @route   GET /comments?postId&id&name&email&body
app.get(
  '/comments',
  asyncHandler(async (req, res) => {
    const commentResponse = await fetch(COMMENTS_API_URL);
    const commentjson = await commentResponse.json();
    let filteredComments = filterComments(commentjson, req.query);
    res.status(200).json(filteredComments);
  })
);

app.use(notFound);
app.use(errorHandler);

const PORT = 5000;
app.listen(PORT, console.log(`Server running at ${PORT}`));
