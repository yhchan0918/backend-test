const calculateNumOfComments = (comments) => {
  return comments.reduce(function (allPost, comment) {
    if (comment['postId'] in allPost) {
      allPost[comment['postId']]++;
    } else {
      allPost[comment['postId']] = 1;
    }
    return allPost;
  }, {});
};
export { calculateNumOfComments };
