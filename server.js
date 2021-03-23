import express from 'express';
import asyncHandler from 'express-async-handler';

import fetch from 'node-fetch';
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

    res.status(200).json(mappedPosts);
  })
);

// @desc    Return a list of comments based on filter
// @route   GET /comments?postId&id&name&email&body
app.get(
  '/comments',
  asyncHandler(async (req, res) => {
    const { postId, id, name, email, body } = req.query;
    const commentResponse = await fetch(COMMENTS_API_URL);
    const commentjson = await commentResponse.json();
    let filteredComments;
    if (postId) {
      filteredComments = commentjson.filter(postIdFilter);
    }
    if (id) {
      filteredComments = filteredComments.filter(idFilter);
    }
    if (name) {
      filteredComments = filteredComments.filter(nameFilter);
    }

    if (email) {
      filteredComments = filteredComments.filter(emailFilter);
    }
    if (body) {
      filteredComments = filteredComments.filter(bodyFilter);
    }

    const postIdFilter = (comment) => {
      const postIdInInt = parseInt(postId);
      return postIdInInt === comment.postId;
    };
    const idFilter = (comment) => {
      const IdInInt = parseInt(id);
      return IdInInt === comment.id;
    };

    const nameFilter = (comment) => {
      let searchRegex = new RegExp(name, 'i');
      const isFound = comment.name.search(searchRegex);

      return isFound === -1 ? false : true;
    };
    const emailFilter = (comment) => {
      let searchRegex = new RegExp(email, 'i');
      const isFound = comment.email.search(searchRegex);

      return isFound === -1 ? false : true;
    };
    const bodyFilter = (comment) => {
      let searchRegex = new RegExp(body, 'i');
      const isFound = comment.body.search(searchRegex);

      return isFound === -1 ? false : true;
    };

    res.status(200).json(comments);
  })
);

app.use(notFound);
app.use(errorHandler);

const PORT = 5000;
app.listen(PORT, console.log(`Server running at ${PORT}`));
