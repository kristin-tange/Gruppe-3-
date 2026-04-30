// KRISTIN TANGE

import { getUserName } from "./helperFunctions";
/* VARIABLES */
export const BASE_URL = "http://localhost:3000/api";
const API_KEY = "group3api";
export let posts = [];
export let users = [];

export async function fetchUsers() {
  const response = await fetch(`${BASE_URL}/users`);
  users = await response.json();
  return users;
}

/* MEETUPS */
/* Fetch meetups from meetupId */
export async function fetchSingleEvent(meetupId) {
  const response = await fetch(`${BASE_URL}/meetups/${meetupId}`);
  const event = await response.json();
  return event;
}

/* POSTS */
/* Fetch posts */
export async function fetchPosts() {
  const response = await fetch(`${BASE_URL}/posts`);
  posts = await response.json();
  return posts;
}

/* Fetch posts related to meetup */
export async function fetchRelatedPosts(meetupId) {
  try {
    const posts = await fetchPosts();
    const relatedPosts = posts.filter((post) => post.meetupId == meetupId);
    return relatedPosts;
  } catch (error) {
    console.error("Kunne ikke hente poster:", error);
  }
}

/* Create posts */

export async function createPost(meetupId, title, txt) {
  try {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        meetupId: Number(meetupId),
        // change userId to loggedIn
        userId: `$`,
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
    const data = response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

/* Update posts */
export async function updatePost(id, data) {
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
    alert("Kunne ikke oppdatere innlegg");
    throw new Error(error.message ?? "Kunne ikke oppdatere innlegg.");
  }
}

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
    alert("Kunne ikke slette innlegg.");
    throw new Error(error.message ?? "Kunne ikke slette innlegg.");
  }
}

/* Create comments */
export async function createComment(postId, existingComments, newComment) {
  const commentObject = {
    id: Date.now(),
    userId: 1,
    comment: newComment,
    created: new Date().toISOString(),
  };
  const updatedComments = [...existingComments, commentObject];
  const response = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      comments: updatedComments,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    alert("Kunne ikke poste kommentar.");
    throw new Error(error.message ?? "Kunne ikke poste kommentar.");
  }
  return response.json();
}

/* Update comments */
export async function updateComment(postId, commentId, updatedComment) {
  const response = await fetch(`${BASE_URL}/posts/${postId}`);
  const post = await response.json();
  const updatedComments = post.comments.map((comment) => {
    if (comment.id === commentId) {
      return {
        ...comment,
        comment: updatedComment,
      };
    }
    return comment;
  });

  const updateResponse = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ comments: updatedComments }),
  });

  if (!updateResponse.ok) {
    const error = await updateResponse.json();
    alert("Kunne ikke oppdatere kommentar.");
    throw new Error(error.message ?? "Kunne ikke oppdatere kommentar.");
  }
  return updateResponse.json();
}

/* "Delete" comments */
export async function deleteComment(postId, commentId) {
  const response = await fetch(`${BASE_URL}/posts/${postId}`);
  const post = await response.json();
  const updatedComments = post.comments.filter((c) => c.id !== commentId);

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
    alert("Kunne ikke slette kommentar.");
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
