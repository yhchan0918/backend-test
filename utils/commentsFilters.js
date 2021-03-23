const filterComments = (comments, query) => {
  const { postId, id, name, email, body } = query;
  let filteredComments = comments;
  if (postId) {
    filteredComments = filteredComments.filter((comment) => {
      const postIdInInt = parseInt(postId);
      return postIdInInt === comment.postId;
    });
  }
  if (id) {
    filteredComments = filteredComments.filter((comment) => {
      const IdInInt = parseInt(id);
      return IdInInt === comment.id;
    });
  }
  if (name) {
    filteredComments = filteredComments.filter((comment) => {
      let searchRegex = new RegExp(name, 'i');
      const isFound = comment.name.search(searchRegex);

      return isFound === -1 ? false : true;
    });
  }

  if (email) {
    filteredComments = filteredComments.filter((comment) => {
      let searchRegex = new RegExp(email, 'i');
      const isFound = comment.email.search(searchRegex);

      return isFound === -1 ? false : true;
    });
  }
  if (body) {
    filteredComments = filteredComments.filter((comment) => {
      let searchRegex = new RegExp(body, 'i');
      const isFound = comment.body.search(searchRegex);

      return isFound === -1 ? false : true;
    });
  }
  return filteredComments;
};

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

export { calculateNumOfComments, filterComments };
