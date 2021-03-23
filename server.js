import express from 'express';
import asyncHandler from 'express-async-handler';

import fetch from 'node-fetch';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

app.use(express.json()); // It parses incoming requests with JSON payloads and is based on body-parser.

app.get(
  '/',
  asyncHandler(async (req, res) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const json = await response.json();

    res.json(json);
  })
);

app.use(notFound);
app.use(errorHandler);

app.listen(5000, console.log('Server running at 5000'));
