import {
  fetchPosts,
  deletePost,
  deleteComment,
  users,
  createComment,
} from "./api";
import { formatDate } from "./helperFunctions";

/* HELPER FUNCTIONS */
/* Get userName from userId */
function getUserName(userId) {
  const user = users.find((u) => u.id == userId);
  console.log(user);
  return user ? user.userName : "Ukjent forfatter";
}

/* RENDER POSTS AND COMMENTS */
export async function loadPosts() {
  try {
    const posts = await fetchPosts();
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
        <div class="edit-btns">
         <button type="button" class="edit-post-btn edit-btns" data-id="${
           post.id
         }">
                Rediger
              </button>
              <button type="button" class="delete-post-btn edit-btns" data-id="${
                post.id
              }">
                Slett
              </button>
      </div>
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
    const commentCounter = postArticle.querySelector(".comment-counter");
    const commentBox = postArticle.querySelector(".hide-comment");
    const commentBtn = postArticle.querySelector(".comment-btn");
    const exitCommentBtn = postArticle.querySelector(".exit-comment-btn");
    const addComment = postArticle.querySelector(".add-comment");
    const commentTxt = postArticle.querySelector(".comment");

    addComment.addEventListener("submit", async (event) => {
      event.preventDefault();
      const newComment = commentTxt.value.trim();

      if (newComment === "") {
        return;
      }

      try {
        await createComment(post.id, post.comments || [], newComment);
        alert("Din kommentar er nå publisert.");
        commentCounter.textContent = post.comments.length;
        commentTxt.value = "";
        commentBox.classList.add("hide-comment");
        await loadPosts();
      } catch (error) {
        console.error("Kunne ikke publisere kommentar:", error);
      }
    });

    const comments = post.comments || [];

    comments.forEach((comment) => {
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
            <div class="second-row">
              <button type="button" class="edit-comment-btn edit-btns" data-id="${
                comment.id
              }">
                Rediger
              </button>
              <button type="button" class="delete-comment-btn edit-btns" data-id="${
                comment.id
              }">
                Slett
              </button>
            </div>
          </div>`;

      const deleteCommentBtn = commentElement.querySelector(
        ".delete-comment-btn"
      );
      deleteCommentBtn.addEventListener("click", async () => {
        try {
          const isConfirmed = confirm(
            "Er du sikker på at du vil slette denne kommentaren?"
          );
          // FIX: make modal with confirm
          if (isConfirmed) {
            await deleteComment(post.id, comment.id);
            await loadPosts();
            //   Change to status-message
            alert("Kommentaren er slettet.");
          }
        } catch (error) {
          console.error(error);
        }
      });
      commentsContainer.appendChild(commentElement);
    });

    commentBtn.addEventListener("click", () => {
      commentBox.classList.toggle("hide-comment");
    });

    exitCommentBtn.addEventListener("click", () => {
      commentBox.classList.add("hide-comment");
      commentTxt.value = "";
    });

    const likeBtn = postArticle.querySelectorAll(".like-btn");
    const dislikeBtn = postArticle.querySelector(".dislike-btn");
    const dislikesCounter = postArticle.querySelector(".dislikes-counter");
    const likesCounter = postArticle.querySelector(".likes-counter");
    let likeCount = post.likes;
    let dislikeCount = post.dislikes;

    likeBtn.forEach((btn) => {
      btn.addEventListener("click", async (event) => {
        const id = Number(event.currentTarget.dataset.id);
        try {
          btn.classList.toggle("active");
          if (btn.classList.contains("active")) {
            likeCount++;
            localStorage.setItem(`userLike${post.id}`, "true");
            // showUpdatedLikes();
          } else {
            localStorage.removeItem(`userLike${post.id}`);
            likeCount--;
            // showUpdatedLikes();
          }
          likesCounter.textContent = likeCount;
        } catch (error) {
          console.error(error);
        }
      });
    });

    // likeBtn.addEventListener("click", () => {
    //   if (likeBtn.classList.contains("active")) {
    //     localStorage.setItem("userLike");
    //     likeCount++;
    //     showUpdatedLikes();
    //   } else {
    //     likeCount--;
    //     localStorage.removeItem("userLike");
    //     showUpdatedLikes();
    //   }
    //   likesCounter.textContent = likeCount;
    // });

    dislikeBtn.addEventListener("click", () => {
      dislikeBtn.classList.toggle("active");
      // localStorage.setItem()
      // localStorage.removeItem()

      if (dislikeBtn.classList.contains("active")) {
        dislikeCount++;
      } else {
        dislikeCount--;
      }
      dislikesCounter.textContent = dislikeCount;
    });
    postContainer.appendChild(postArticle);
  });

  // document.querySelectorAll(".edit-post-btn").forEach((btn) => {
  //   btn.addEventListener("click", async (event) => {
  //     const id = Number(event.target.dataset.id);
  //     try {
  //       postOverlay.style.display = "block";
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   });
  // });

  document.querySelectorAll(".delete-post-btn").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const id = Number(event.target.dataset.id);

      // Korte ned if (se eksempel: simple-todo)
      try {
        const isConfirmed = confirm(
          "Er du sikker på at du vil slette dette innlegget?"
        );

        // FIX: make modal with confirm
        if (isConfirmed) {
          await deletePost(id);
          await loadPosts();
          alert("Innlegget er slettet.");
        }
      } catch (error) {
        console.error(error);
      }
    });
  });
}
