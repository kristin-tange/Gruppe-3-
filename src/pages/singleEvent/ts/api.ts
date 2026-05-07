// KRISTIN TANGE

import type { User, Post, Comment, Meetup } from "./types";

/* VARIABLES */
export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const API_KEY = import.meta.env.VITE_API_KEY;

export let posts: Post[] = [];
export let users: User[] = [];

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${BASE_URL}/users`);

    if (!response.ok) {
      throw new Error(`Kunne ikke hente brukere: ${response.status}`);
    }

    users = await response.json();
    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
/* MEETUPS */
/* Fetch meetups from meetupId */
export async function fetchSingleEvent(meetupId: number): Promise<Meetup> {
  try {
    const response = await fetch(`${BASE_URL}/meetups/${meetupId}`);

    if (!response.ok) {
      throw new Error(`Kunne ikke hente arrangement: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/* POSTS */
/* Fetch posts */
export async function fetchPosts(): Promise<Post[]> {
  try {
    const response = await fetch(`${BASE_URL}/posts`);

    if (!response.ok) {
      throw new Error(`Kunne ikke hente poster: ${response.status}`);
    }

    posts = await response.json();
    return posts;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/* Fetch posts related to meetup */
export async function fetchRelatedPosts(meetupId: number): Promise<Post[]> {
  try {
    const posts = await fetchPosts();
    const relatedPosts = posts.filter((post) => post.meetupId === meetupId);
    return relatedPosts;
  } catch (error) {
    console.error("Kunne ikke hente relaterte poster.");
    return [];
  }
}

/* Create posts */

export async function createPost(
  meetupId: number,
  title: string,
  txt: string,
  currentUser: User
): Promise<Post> {
  try {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        meetupId: Number(meetupId),
        userId: currentUser.id,
        postName: title,
        text: txt,
        likes: 0,
        dislikes: 0,
        comments: [],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? "Kunne ikke poste innlegg.");
    }

    const createdPost = await response.json();
    return createdPost;
  } catch (error) {
    throw error;
  }
}

/* Update posts */
export async function updatePost(id: number, updatedPost: {}): Promise<Post> {
  try {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(updatedPost),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? "Kunne ikke oppdatere innlegg.");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    alert("Kunne ikke oppdatere innlegg");
    throw error;
  }
}

export async function updatePostReactions(
  id: number,
  likes: number,
  dislikes: number
): Promise<Post> {
  try {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        likes: likes,
        dislikes: dislikes,
      }),
    });

    if (!response.ok) {
      throw new Error("Kunne ikke oppdatere reaksjoner.");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    alert("Kunne ikke oppdatere reaksjoner.");
    throw error;
  }
}
/* Delete posts */
export async function deletePost(id: number): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? "Kunne ikke slette innlegg.");
    }
    return;
  } catch (error) {
    alert("Kunne ikke slette innlegg.");
    throw error;
  }
}

/* Create comments */
export async function createComment(
  postId: number,
  newComment: string,
  currentUser: User
): Promise<Comment> {
  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}`);
    const post = await response.json();

    const comments: Comment[] = post.comments || [];

    const newCommentObject = {
      id: comments.length > 0 ? Math.max(...comments.map((c) => c.id)) + 1 : 1,
      userId: currentUser.id,
      comment: newComment,
      created: new Date().toISOString().slice(0, 19),
    };
    const updatedComments = [...comments, newCommentObject];

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
      const error = await updateResponse.json();
      throw new Error(error.message ?? "Kunne ikke poste kommentar.");
    }
    return await updateResponse.json();
  } catch (error) {
    console.error(error);
    alert("Kunne ikke poste kommentar.");
    throw error;
  }
}
/* Update comments */
export async function updateComment(
  postId: number,
  commentId: number,
  updatedComment: string
): Promise<Comment> {
  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}`);
    const post = await response.json();

    const comments: Comment[] = post.comments || [];

    const updatedComments = comments.map((comment) => {
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
      throw new Error(error.message ?? "Kunne ikke oppdatere kommentar.");
    }
    return await updateResponse.json();
  } catch (error) {
    console.error(error);
    alert("Kunne ikke oppdatere kommentar.)");
    throw error;
  }
}

/* "Delete" comments */
export async function deleteComment(
  postId: number,
  commentId: number
): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}`);
    const post = await response.json();
    const comments: Comment[] = post.comments || [];

    const updatedComments = comments.filter(
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
      const error = await updateResponse.json();
      throw new Error(error.message ?? "Kunne ikke slette kommentar");
    }
    return updateResponse.json();
  } catch (error) {
    console.error(error);
    alert("Kunne ikke slette kommentar");
    throw error;
  }
}
