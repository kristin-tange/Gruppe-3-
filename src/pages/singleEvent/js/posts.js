// KRISTIN TANGE

import { postOverlay, editPost } from "./singleEvent";
import {
  fetchRelatedPosts,
  deletePost,
  updatePostReactions,
  deleteComment,
  users,
  createComment,
  updateComment,
} from "./api";
import { formatDate, meetupId } from "./helperFunctions";

// VARIABLER
let editingCommentId = null;
export const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const currentUserId = currentUser?.id;
export const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

/* HELPER FUNCTIONS */
/* Get userName from userId */
function getUserName(userId) {
  const user = users.find((u) => u.id == userId);
  return user ? user.userName : "Ukjent forfatter";
}

function loadReactions(currentUserId, postId, likeBtn, dislikeBtn) {
  if (dislikeBtn) dislikeBtn.classList.remove("active");
  if (likeBtn) likeBtn.classList.remove("active");

  const userDislike = localStorage.getItem(`${currentUserId}dislikes${postId}`);
  const userLike = localStorage.getItem(`${currentUserId}likes${postId}`);

  if (userDislike && dislikeBtn) {
    dislikeBtn.classList.add("active");
  }
  if (userLike && likeBtn) {
    likeBtn.classList.add("active");
  }
}

/* RENDER POSTS AND COMMENTS */
export async function loadPosts() {
  try {
    const posts = await fetchRelatedPosts(meetupId);
    showPosts(posts);
  } catch (error) {
    console.error("Kunne ikke hente poster:", error);
  }
}

export function showComments(commentList) {
  commentList.innerHTML = "";
  commentCounter.innerHTML = `${commentList.length}`;
  if (commentList.length === 0) {
    commentContainer.innerHTML = `<p> Ingen kommentarer å vise ennå. </p>`;
  }
}

export function showPosts(postList) {
  const postContainer = document.getElementById("post-container");
  const postCounter = document.getElementById("post-counter");
  postContainer.innerHTML = "";
  postCounter.innerHTML = `${postList.length}`;

  if (postList.length === 0) {
    postCounter.style.display = "none";
    postContainer.innerHTML = `<p> Ingen innlegg å vise ennå. </p>`;
    return;
  }

  postList.forEach((post) => {
    const canEdit = Number(currentUserId) === Number(post.userId);

    const postArticle = document.createElement("article");
    postArticle.className = "published-post";
    postArticle.innerHTML = `
    <div class="post-grid">
    <div>
    <div class="user">
    <img
    src="/public/assets/img/placeholder-profile.png"
    alt="profilbilde"
    class="placeholder-profile"
    width="32px"
    />
    <span class="user-name">${getUserName(post.userId)}</span>
    </div>
    <h4 class="post-name">${post.postName}</h4>
    </div>
    <p class="muted post-date">${formatDate(post.created)}</p>

  <p class="post-text">
  ${post.text}
  </p>
 
    <div class="reaction-btns">
      <div class="likes">
        <button class="post-icons like-btn" type="button" data-id="${post.id}">
          <img src="/public/assets/icons/like.png" width="20px" />
        </button>
        <span class="likes-counter muted">${post.likes || 0}</span>
      </div>
      <div class="dislikes">
          <button class="post-icons dislike-btn" type="button" data-id="${
            post.id
          }">
            <img src="/public/assets/icons/dislike.png" width="20px" />
          </button>
          <span class="dislikes-counter muted">${post.dislikes || 0}</span>
      </div>
        <div class="comments">
          <button class="post-icons comment-btn" type="button">
            <img src="/public/assets/icons/comment.png" width="20px" />
          </button>
          <span class="comment-counter muted">${
            post.comments?.length || 0
          }</span>
        </div>
        </div>
        ${
          canEdit
            ? `<div class="edit-btns">
         <button type="button" class="edit-post-btn edit-btns" data-id="${post.id}" data-user-id="${post.userId}">
                Rediger
              </button>
              <button type="button" class="delete-post-btn edit-btns" data-id="${post.id}" data-user-id="${post.userId}">
                Slett
              </button>
      </div>`
            : ""
        }
        </div>
  </div>

  <section class="comment-section">
    <form class="add-comment hide-comment">
    <div class="post-comments">
      <div class="user">
        <img
          src="/public/assets/img/placeholder-profile.png"
          alt="profilbilde"
          class="placeholder-profile"
          width="32px"
        />
        <span class="user-name"></span>
      </div>
      <textarea
        class="comment"
        name="kommentar"
        rows="4"
        cols="30"
        placeholder="Legg til kommentar..."
      ></textarea>
    </div>
    <div class="post-comments-btns">
      <button class="post-comment-btn btn btn-primary" type="submit">Send</button>
      <button class="exit-comment-btn btn btn-secondary" type="button">
        Avbryt
      </button>
    </div>
      <div class="comment-container">
      </div>
    </form>
    <div class="comment-list">
    </div>
   </section>
    `;

    const commentsContainer = postArticle.querySelector(".comment-list");
    const commentBox = postArticle.querySelector(".hide-comment");
    const commentBtn = postArticle.querySelector(".comment-btn");
    const exitCommentBtn = postArticle.querySelector(".exit-comment-btn");
    const commentForm = postArticle.querySelector(".add-comment");
    const commentTxt = postArticle.querySelector(".comment");
    const postCommentBtn = postArticle.querySelector(".post-comment-btn");

    commentForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const newComment = commentTxt.value.trim();

      if (!newComment) return;

      try {
        if (editingCommentId !== null) {
          await updateComment(post.id, editingCommentId, newComment);
          alert("Kommentaren er redigert.");
          editingCommentId = null;
        } else {
          await createComment(post.id, newComment);
        }
        commentTxt.value = "";
        commentTxt.style.backgroundColor = "";
        commentBox.classList.add("hide-comment");
        await loadPosts();
      } catch (error) {
        console.error("Kunne ikke publisere kommentar:", error);
        alert("Kunne ikke publisere kommentar.");
      }
    });

    const comments = post.comments || [];

    comments.forEach((comment) => {
      const canEdit = Number(currentUserId) === Number(comment.userId);
      const commentElement = document.createElement("article");
      commentElement.innerHTML = `
          <div class="comment-container">
          <p class="muted comment-date">${formatDate(comment.created)}</p>
            <div>
              <div class="user">
                <img
                  src="/public/assets/img/placeholder-profile.png"
                  alt="profilbilde"
                  class="placeholder-profile"
                  width="32px"
                />
                <span class="user-name">${getUserName(comment.userId)}</span>
                
              </div>
              <p class="comment-text">${comment.comment}</p>
            </div>
            <div class="second-row">${
              canEdit
                ? `<button type="button" class="edit-comment-btn edit-btns" data-id="${comment.id}" data-user-id="${comment.userId}">
                Rediger
              </button>
              <button type="button" class="delete-comment-btn edit-btns" data-id="${comment.id}" data-user-id="${comment.userId}">
                Slett
              </button>`
                : ""
            }
             
            </div>
          </div>`;

      const editCommentBtn = commentElement.querySelector(".edit-comment-btn");
      if (editCommentBtn) {
        editCommentBtn.addEventListener("click", async () => {
          editingCommentId = comment.id;
          commentTxt.value = comment.comment;
          commentBox.classList.remove("hide-comment");
          commentTxt.style.backgroundColor = "#FFF8E1";
          commentTxt.focus();
          if (postCommentBtn) postCommentBtn.textContent = "Lagre endringer";
        });
      }

      const deleteCommentBtn = commentElement.querySelector(
        ".delete-comment-btn"
      );
      if (deleteCommentBtn) {
        deleteCommentBtn.addEventListener("click", async () => {
          console.log("Post ID:", post.id);
          console.log("Comment ID:", comment.id);
          try {
            const isConfirmed = confirm(
              "Er du sikker på at du vil slette denne kommentaren?"
            );
            if (isConfirmed) {
              await deleteComment(post.id, comment.id);
              await loadPosts();
              alert("Kommentaren er slettet.");
            }
          } catch (error) {
            console.error(error);
          }
        });
      }

      commentsContainer.appendChild(commentElement);
    });

    if (commentBtn) {
      commentBtn.addEventListener("click", () => {
        commentBox.classList.toggle("hide-comment");
        commentTxt.style.backgroundColor = "";

        if (!isLoggedIn) {
          const isConfirmed = confirm(
            "Du må være innlogget for å kommentere. Ønsker du å logge inn?"
          );

          commentBox.classList.add("hide-comment");

          if (!isConfirmed) return;

          window.location.href = "/src/pages/login/login.html";
          return;
        }
      });
    }

    if (exitCommentBtn) {
      exitCommentBtn.addEventListener("click", () => {
        commentBox.classList.add("hide-comment");
        commentTxt.value = "";
        commentTxt.style.backgroundColor = "";
      });
    }

    const likeBtn = postArticle.querySelector(".like-btn");
    const dislikeBtn = postArticle.querySelector(".dislike-btn");
    const dislikesCounter = postArticle.querySelector(".dislikes-counter");
    const likesCounter = postArticle.querySelector(".likes-counter");

    loadReactions(currentUserId, post.id, likeBtn, dislikeBtn);

    let likeCount = post.likes || 0;
    let dislikeCount = post.dislikes || 0;

    if (likeBtn) {
      likeBtn.addEventListener("click", async () => {
        if (!isLoggedIn) {
          const isConfirmed = confirm(
            "Du må være innlogget for å reagere. Ønsker du å logge inn?"
          );

          if (!isConfirmed) return;

          window.location.href = "/src/pages/login/login.html";
          return;
        }

        try {
          likeBtn.classList.toggle("active");
          if (likeBtn.classList.contains("active")) {
            likeCount++;
            localStorage.setItem(`${currentUserId}likes${post.id}`, "true");

            if (dislikeBtn.classList.contains("active")) {
              dislikeBtn.classList.remove("active");

              if (dislikeCount > 0) {
                localStorage.removeItem(`${currentUserId}dislikes${post.id}`);
                dislikeCount--;
              }
              dislikesCounter.textContent = dislikeCount;
            }
          } else {
            if (likeCount > 0) {
              likeCount--;
            }
            localStorage.removeItem(`${currentUserId}likes${post.id}`);
          }
          likesCounter.textContent = likeCount;
          await updatePostReactions(post.id, likeCount, dislikeCount);
        } catch (error) {
          console.error(error);
        }
      });
    }

    if (dislikeBtn) {
      dislikeBtn.addEventListener("click", async () => {
        if (!isLoggedIn) {
          const isConfirmed = confirm(
            "Du må være innlogget for å reagere. Ønsker du å logge inn?"
          );

          if (!isConfirmed) return;

          window.location.href = "/src/pages/login/login.html";
          return;
        }

        try {
          dislikeBtn.classList.toggle("active");
          if (dislikeBtn.classList.contains("active")) {
            dislikeCount++;
            localStorage.setItem(`${currentUserId}dislikes${post.id}`, "true");

            if (likeBtn.classList.contains("active")) {
              localStorage.removeItem(`${currentUserId}likes${post.id}`);
              likeBtn.classList.remove("active");

              if (likeCount > 0) {
                likeCount--;
              }

              likesCounter.textContent = likeCount;
            }
          } else {
            if (dislikeCount > 0) {
              dislikeCount--;
              localStorage.removeItem(`${currentUserId}dislikes${post.id}`);
            }
          }
          dislikesCounter.textContent = dislikeCount;

          await updatePostReactions(post.id, likeCount, dislikeCount);
        } catch (error) {
          console.error(error);
        }
      });
    }
    postContainer.appendChild(postArticle);
  });

  document.querySelectorAll(".edit-post-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = Number(e.currentTarget.dataset.id);
      const postUserId = Number(e.currentTarget.dataset.userId);

      try {
        await editPost(id);
        postOverlay.style.display = "block";
      } catch (error) {
        console.error(error);
      }
    });
  });

  document.querySelectorAll(".delete-post-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = Number(e.currentTarget.dataset.id);
      const postUserId = Number(e.currentTarget.dataset.userId);

      // Korte ned if (se eksempel: simple-todo)
      try {
        if (currentUserId !== postUserId) {
          return;
        }
        const isConfirmed = confirm(
          "Er du sikker på at du vil slette dette innlegget?"
        );
        if (!isConfirmed) return;

        await deletePost(id);
        localStorage.removeItem(`${currentUserId}dislikes${id}`);
        localStorage.removeItem(`${currentUserId}likes${id}`);
        await loadPosts();
        alert("Innlegget er slettet.");
      } catch (error) {
        console.error(error);
      }
    });
  });
}
