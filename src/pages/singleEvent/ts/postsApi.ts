// KRISTIN TANGE

import type { User, Post, Comment, Meetup } from "../../../ts/types";
import { BASE_URL, API_KEY } from "../../../ts/config";

let posts: Post[] = [];

export async function fetchSingleEvent(meetupId: number): Promise<Meetup> {
  try {
    const response = await fetch(`${BASE_URL}/meetups/${meetupId}`);

    if (!response.ok) {
      throw new Error(`Kunne ikke hente arrangementet: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchPosts(): Promise<Post[]> {
  try {
    const response = await fetch(`${BASE_URL}/posts`);

    if (!response.ok) {
      throw new Error(`Kunne ikke hente innlegg: ${response.status}`);
    }

    posts = await response.json();
    return posts;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchSinglePost(id: number): Promise<Post> {
  try {
    const response = await fetch(`${BASE_URL}/posts/${id}`);

    if (!response.ok) {
      throw new Error(`Kunne ikke hente innlegget: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchRelatedPosts(meetupId: number): Promise<Post[]> {
  try {
    const posts = await fetchPosts();
    const relatedPosts = posts.filter((post) => post.meetupId === meetupId);
    return relatedPosts;
  } catch (error) {
    console.error("Kunne ikke hente relaterte poster", error);
    throw error;
  }
}

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
        Authorization: `Bearer ${API_KEY}`,
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
      throw new Error(`Kunne ikke lagre innlegg: ${response.status}`);
    }

    const createdPost = await response.json();
    return createdPost;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updatePost(
  id: number,
  updatedPost: Partial<Post>
): Promise<Post> {
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
      throw new Error(`Kunne ikke oppdatere innlegg: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updatePostReactions(
  id: number,
  likes: number,
  dislikes: number
): Promise<Post> {
  try {
    return await updatePost(id, {
      likes,
      dislikes,
    });
  } catch (error) {
    console.error("Kunne ikke oppdatere reaksjoner.", error);
    throw error;
  }
}

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
      throw new Error(`Kunne ikke slette innlegg: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createComment(
  postId: number,
  newComment: string,
  currentUser: User
): Promise<Post> {
  try {
    const post = await fetchSinglePost(postId);
    const comments: Comment[] = post.comments || [];

    const newCommentObject: Comment = {
      id: comments.length > 0 ? Math.max(...comments.map((c) => c.id)) + 1 : 1,
      userId: currentUser.id,
      comment: newComment,
      created: new Date().toISOString(),
    };

    return await updateAllComments(postId, [...comments, newCommentObject]);
  } catch (error) {
    console.error("Kunne ikke lagre kommentar.", error);
    throw error;
  }
}

export async function updateComment(
  postId: number,
  commentId: number,
  updatedComment: string
): Promise<Post> {
  try {
    const post = await fetchSinglePost(postId);
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

    return updateAllComments(postId, updatedComments);
  } catch (error) {
    console.error("Kunne ikke oppdatere kommentarer.", error);
    throw error;
  }
}

export async function updateAllComments(
  postId: number,
  updatedComments: Comment[]
): Promise<Post> {
  return updatePost(postId, {
    comments: updatedComments,
  });
}

export async function deleteComment(
  postId: number,
  commentId: number
): Promise<Post> {
  try {
    const post = await fetchSinglePost(postId);
    const comments: Comment[] = post.comments || [];
    const updatedComments = comments.filter(
      (comment) => comment.id !== commentId
    );
    return updateAllComments(postId, updatedComments);
  } catch (error) {
    console.error("Kunne ikke slette kommentar.", error);
    throw error;
  }
}
