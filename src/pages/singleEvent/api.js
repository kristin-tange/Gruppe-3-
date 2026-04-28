/* MEETUPS */
/* Fetch meetups from meetupId */
export async function fetchSingleEvent(meetupId) {
  const response = await fetch(`${BASE_URL}/meetups/${meetupId}`);
  const event = await response.json();
  showSingleEvent(event);
}

/* POSTS */
/* Fetch posts */
export async function fetchPosts() {
  const response = await fetch(`${BASE_URL}/posts`);
  posts = await response.json();
  return posts;
}

/* Fetch posts related to meetup */
export async function fetchRelatedPosts() {
  try {
    const posts = await fetchPosts();
    const filteredPosts = posts.filter((post) => post.meetupId == meetupId);
    showPosts(filteredPosts);
  } catch (error) {
    "Kunne ikke hente poster:", error;
  }
}

/* Create posts */
export async function createPost(title, txt) {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      meetupId: Number(meetupId),
      userId: 1,
      likes: 0,
      dislikes: 0,
      postName: title,
      text: txt,
      comments: [],
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Kunne ikke poste innlegg.");
  }
  return response.json();
}

/* Edit posts */
/* async function editPost(id, data) {
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Kunne ikke oppdatere innlegg.");
  }
}
 */

/* Delete posts */
export async function deletePost(id) {
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Kunne ikke slette innlegg.");
  }
}

/* Create comments */
/* export async function createComment(postId, newComment) {
  const response = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      comment: newComment,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Kunne ikke poste kommentar.");
  }
  return response.json();
} */

/* Edit comments */
/* Delete comments */
export async function deleteComment(postId, commentId) {
  const response = await fetch(`${BASE_URL}/posts/${postId}`);
  const post = await response.json();
  const updatedComments = post.comments.filter(
    (comment) => comment.id !== commentId
  );

  const updateResponse = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      comments: updatedComments,
    }),
  });
  if (!updateResponse.ok) {
    throw new Error("Kunne ikke slette kommentar");
  }
  return updateResponse.json();
}

/* REACTIONS */
// TODO: connect to API
// TODO: create reactions
// TODO: edit reactions
// TODO: delete reactions

// function showUpdatedLikes() {
//   const savedUserLikes = localStorage.getItem(`userLike${post.id}`);
//   display.textContent =
//   if (savedUserLikes === "true") {

//   }
// }
