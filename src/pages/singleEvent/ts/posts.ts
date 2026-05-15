// KRISTIN TANGE

import {
  fetchRelatedPosts,
  deletePost,
  updatePostReactions,
  fetchSinglePost,
  createPost,
  updatePost,
} from "./postsApi";
import {
  formatDate,
  meetupId,
  getUserName,
  getProfilePicture,
  getCurrentUser,
  getIsLoggedIn,
  showErrorMessage,
  showSuccessMessage,
  resetEditMode,
} from "./helpers";
import type { Post } from "../../../ts/types";
import { showComments } from "./comment";

const postOverlay = document.getElementById("post-overlay") as HTMLElement;
const postForm = document.getElementById("post-form") as HTMLFormElement;
const postHeading = document.getElementById(
  "form-heading"
) as HTMLHeadingElement;
const postTitleInput = document.getElementById(
  "new-post-title"
) as HTMLInputElement;
const postTxtInput = document.getElementById(
  "new-post-txt"
) as HTMLTextAreaElement;
const publishBtn = document.getElementById("publish-btn") as HTMLButtonElement;
const postContainer = document.getElementById(
  "post-container"
) as HTMLDivElement;
const postCounter = document.getElementById("post-counter") as HTMLSpanElement;
let editingPostId: number | null = null;
let originalTitle = "";
let originalTxt = "";

function showEditMode(post: Post) {
  postTitleInput.value = post.postName;
  postTxtInput.value = post.text;

  originalTitle = post.postName;
  originalTxt = post.text;

  if (publishBtn) publishBtn.textContent = "Lagre endringer";
  if (postHeading) postHeading.textContent = "Rediger innlegg";
  postTitleInput.style.backgroundColor = "#FFF8E1";
  postTxtInput.style.backgroundColor = "#FFF8E1";
  editingPostId = post.id;
}

function loadReactions(
  postId: number,
  likeBtn: HTMLButtonElement,
  dislikeBtn: HTMLButtonElement
): void {
  const currentUserId = getCurrentUser()?.id;
  if (!currentUserId) return;
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

export async function loadPosts(): Promise<void> {
  if (!meetupId) {
    showErrorMessage("Kunne ikke hente arrangementet.");
    return;
  }

  showLoadingPosts();
  try {
    const posts = await fetchRelatedPosts(meetupId);
    setTimeout(() => {
      showPosts(posts);
    }, 1500);
  } catch (error) {
    console.error("Kunne ikke hente poster:", error);
  }
}

function showLoadingPosts(): void {
  postContainer.innerHTML = `<span>Laster innlegg...</span><div class="loading-container" aria-live="polite"><span class="spinner" aria-hidden="true"></span></div>`;
  postCounter.style.display = "none";
}
if (postForm) {
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const currentUser = getCurrentUser();
    const title = postTitleInput.value.trim();
    const txt = postTxtInput.value.trim();

    try {
      if (editingPostId !== null) {
        if (title === originalTitle && txt === originalTxt) {
          showErrorMessage("Ingen endringer å lagre.");
          return;
        }
        await updatePost(editingPostId, {
          postName: title,
          text: txt,
        });
        showSuccessMessage("Innlegget er redigert.");
        editingPostId = null;
        originalTitle = "";
        originalTxt = "";
      } else {
        if (!currentUser) return;

        await createPost(meetupId, title, txt, currentUser);
        showSuccessMessage("Innlegget er publisert.");
      }
      await loadPosts();
      resetEditMode();
    } catch (error) {
      console.error("Kunne ikke lagre innlegg:", error);
      showErrorMessage("Kunne ikke publisere innlegg.");
    }
  });
}

function renderPost(post: Post, canEdit: boolean): string {
  const postArticle = `
    <div class="post-grid">
    <div class="first-row">
    <div class="user">
    <img
    src="${getProfilePicture(post.userId)}"
    alt=""
    aria-hidden="true"
    class="profile-picture"
    width="32"
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
        <button class="post-icons like-btn" type="button" aria-label="Lik innlegg" data-id="${
          post.id
        }">
          <img src="/assets/icons/like.png" width="20" alt="" aria-hidden="true"/>
        </button>
        <span class="likes-counter muted">${post.likes || 0}</span>
      </div>
      <div class="dislikes">
          <button class="post-icons dislike-btn" type="button" aria-label="Mislik innlegg" data-id="${
            post.id
          }">
            <img src="/assets/icons/dislike.png" width="20" alt="" aria-hidden="true"/>
          </button>
          <span class="dislikes-counter muted">${post.dislikes || 0}</span>
      </div>
        <div class="comments">
          <button class="post-icons comment-btn" type="button" aria-label="Kommenter innlegg">
            <img src="/assets/icons/comment.png" width="20" alt="" aria-hidden="true"/>
          </button>
          <span class="comment-counter muted">${
            post.comments?.length || 0
          }</span>
        </div>
        </div>
        ${
          canEdit
            ? `<div class="edit-btns">
         <button type="button" class="edit-post-btn edit-btns" aria-label="Rediger innlegg" data-id="${post.id}" data-user-id="${post.userId}">
                Rediger
              </button>
              <button type="button" class="delete-post-btn edit-btns" aria-label="Slett innlegg" data-id="${post.id}" data-user-id="${post.userId}">
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
          src=${getProfilePicture(post.userId)}
          alt=""
          aria-hidden="true"
          class="profile-picture"
          width="32"
        />
        <span class="user-name"></span>
      </div>
      <textarea
        class="comment"
        aria-label="Skriv inn din kommentar"
        name="kommentar"
        rows="4"
        cols="30"
        placeholder="Legg til kommentar..."
      ></textarea>
    </div>
    <div class="post-comments-btns">
      <button class="post-comment-btn btn btn-primary active" type="submit">Send</button>
      <button class="exit-comment-btn btn btn-secondary active" type="button">
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
  return postArticle;
}

function showPosts(postList: Post[]) {
  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.id;
  const isLoggedIn = getIsLoggedIn();
  postContainer.innerHTML = "";
  postCounter.style.display = "inline-flex";
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
    postArticle.innerHTML = renderPost(post, canEdit);

    const likeBtn = postArticle.querySelector(".like-btn") as HTMLButtonElement;
    const dislikeBtn = postArticle.querySelector(
      ".dislike-btn"
    ) as HTMLButtonElement;
    const dislikesCounter = postArticle.querySelector(
      ".dislikes-counter"
    ) as HTMLSpanElement;
    const likesCounter = postArticle.querySelector(
      ".likes-counter"
    ) as HTMLSpanElement;

    if (currentUserId) loadReactions(post.id, likeBtn, dislikeBtn);

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
              dislikesCounter.textContent = `${dislikeCount}`;
            }
          } else {
            if (likeCount > 0) {
              likeCount--;
            }
            localStorage.removeItem(`${currentUserId}likes${post.id}`);
          }
          likesCounter.textContent = `${likeCount}`;
          await updatePostReactions(post.id, likeCount, dislikeCount);
        } catch (error) {
          console.error(error);
          showErrorMessage("Kunne ikke reagere på innlegg.");
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

              likesCounter.textContent = `${likeCount}`;
            }
          } else {
            if (dislikeCount > 0) {
              dislikeCount--;
              localStorage.removeItem(`${currentUserId}dislikes${post.id}`);
            }
          }
          dislikesCounter.textContent = `${dislikeCount}`;

          await updatePostReactions(post.id, likeCount, dislikeCount);
        } catch (error) {
          console.error(error);
          showErrorMessage("Kunne ikke reagere på innlegg.");
        }
      });
    }
    postContainer.appendChild(postArticle);

    showComments(post, postArticle, currentUser, isLoggedIn);
  });

  document.querySelectorAll(".edit-post-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = Number((e.currentTarget as HTMLElement).dataset.id);

      try {
        const post = await fetchSinglePost(id);
        showEditMode(post);

        if (postOverlay) postOverlay.style.display = "block";
      } catch (error) {
        console.error(error);
        showErrorMessage("Noe gikk galt.");
      }
    });
  });

  document.querySelectorAll(".delete-post-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = Number((e.currentTarget as HTMLElement).dataset.id);
      const postUserId = Number(
        (e.currentTarget as HTMLElement).dataset.userId
      );

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
        showSuccessMessage("Innlegget er slettet.");
      } catch (error) {
        console.error(error);
        showErrorMessage("Noe gikk galt.");
      }
    });
  });
}
