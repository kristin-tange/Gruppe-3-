import type { User, Comment, Post } from "./types";
import { deleteComment, createComment, updateComment } from "./api";
import { formatDate, getProfilePicture, getUserName } from "./helperFunctions";
import { loadPosts } from "./posts";

let editingCommentId: number | null = null;

function renderComment(
  post: Post,
  postArticle: HTMLElement,
  currentUser: User | null,
  comment: Comment
) {
  const canEdit = currentUser?.id === comment.userId;
  const commentElement = document.createElement("article");

  commentElement.innerHTML = `
          <div class="comment-container">
          <p class="muted comment-date">${formatDate(comment.created)}</p>
            
              <div class="user">
                <img
                  src=${getProfilePicture(comment.userId)}
                  alt=""
                  aria-hidden="true"
                  class="profile-picture"
                  width="32"
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

  const commentsContainer = postArticle.querySelector(
    ".comment-list"
  ) as HTMLDivElement;
  const commentBox = postArticle.querySelector(
    ".add-comment"
  ) as HTMLFormElement;

  const commentTxt = postArticle.querySelector(
    ".comment"
  ) as HTMLTextAreaElement;
  const postCommentBtn = postArticle.querySelector(
    ".post-comment-btn"
  ) as HTMLButtonElement;

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

  const deleteCommentBtn = commentElement.querySelector(".delete-comment-btn");
  if (deleteCommentBtn) {
    deleteCommentBtn.addEventListener("click", async () => {
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
}

export function showComments(
  post: Post,
  postArticle: HTMLElement,
  currentUser: User | null,
  isLoggedIn: boolean
) {
  const commentForm = postArticle.querySelector(
    ".add-comment"
  ) as HTMLButtonElement;
  const commentTxt = postArticle.querySelector(
    ".comment"
  ) as HTMLTextAreaElement;
  const commentBox = postArticle.querySelector(
    ".add-comment"
  ) as HTMLFormElement;
  const commentBtn = postArticle.querySelector(
    ".comment-btn"
  ) as HTMLButtonElement;
  const exitCommentBtn = postArticle.querySelector(
    ".exit-comment-btn"
  ) as HTMLButtonElement;

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

  commentForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newComment: string | null = commentTxt?.value.trim();

    if (!newComment || !currentUser) return;

    try {
      if (editingCommentId !== null) {
        await updateComment(post.id, editingCommentId, newComment);
        alert("Kommentaren er redigert.");
        editingCommentId = null;
      } else {
        await createComment(post.id, newComment, currentUser);
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
    renderComment(post, postArticle, currentUser, comment);
  });
}
