// KRISTIN TANGE

// FETCH DATA
const BASE_URL = "http://localhost:3000/api";

const API_KEY = "group3api";

// function getApiKey() {
//   return localStorage.getItem("api-key");
// }

// GET ID FROM WINDOW
const params = new URLSearchParams(window.location.search);
const meetupId = params.get("id");

// EMPTY ARRAYS
let users = [];
let posts = [];
let comments = [];

// let postId = null;
// let commentId = null;

// FETCH USERNAME FOR POSTS AND COMMENTS

function getUserName(userId) {
  const user = users.find((u) => u.id == userId);
  console.log(user);
  return user ? user.userName : "Ukjent forfatter";
}

// FETCH EVENTS(MEETUPS)
async function fetchSingleEvent(meetupId) {
  const response = await fetch(`${BASE_URL}/meetups/${meetupId}`);
  const event = await response.json();
  showSingleEvent(event);
}

function formatDate(data) {
  const date = new Date(data);
  return date.toLocaleDateString("no-NO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(data) {
  const time = new Date(data);
  return time.toLocaleTimeString("no-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function showSingleEvent(event) {
  const heroContainer = document.getElementById("hero-container");
  const descriptionContainer = document.getElementById("description-container");
  const formattedTags = event.tags.join(", ");

  document.title = `${event.name}`;

  heroContainer.innerHTML = `<section role="img" class="event-hero"  alt="${
    event.imageAlt
  }" style="background: linear-gradient(rgba(207, 207, 207, 0.55),rgba(131, 131, 131, 0.55)), url('${
    event.image
  }')center / cover no-repeat;">
      <div class="hero-overlay">
        <h1 class="event-title">${event.name}</h1>
        <p class="event-date hero-textbox">${formatDate(event.date)}</p>
        <div class="event-info hero-textbox">
          <p class="event-place">${event.location} /</p>
          <p class="event-time">kl. ${formatTime(event.date)} /</p>
          <p class="event-price">${event.price} </p>
        </div>
        <div id="filter${event.category}" class="category tag hero-tag">${
    event.category
  }</div>
      </div>
    </section>`;

  descriptionContainer.innerHTML = `<section class="section-grid">
  <div class="description-header">
  <h2>Om arrangementet</h2>
  <p class="tags">#${formattedTags}</p>
  </div>
  <p>
  ${event.description}
  </p>
  <p class="muted margin-bottom">
  Opprettet: <span id="created">${formatDate(event.created)} kl. ${formatTime(
    event.created
  )}</span> <br />Sist
            oppdatert:
            <span id="updated">${formatDate(event.updated)} kl. ${formatTime(
    event.updated
  )}</span>
          </p>
            <button class="btn btn-primary" id="sign-up-btn">Påmelding</button>
        </section>`;

  // TEMPORARY "SIGN-UP"
  const signUpBtn = document.getElementById("sign-up-btn");
  signUpBtn.addEventListener("click", () => {
    alert("Din påmelding er registrert.");
  });

  //NICETOHAVE: sign-up-form, show sign-up-information, icon og counter for sign-up
}

// POST-OVERLAY

const overlayBtn = document.getElementById("open-overlay-btn");
const closeOverlayBtn = document.getElementById("close-btn");
const postOverlay = document.getElementById("post-overlay");
const postForm = document.getElementById("post-form");

const postTitleInput = document.getElementById("new-post-title");
const postTxtInput = document.getElementById("new-post-txt");

overlayBtn.addEventListener("click", () => {
  postOverlay.style.display = "block";
});

closeOverlayBtn.addEventListener("click", () => {
  postOverlay.style.display = "none";
});

postForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = postTitleInput.value.trim();
  const txt = postTxtInput.value.trim();

  try {
    await createPost(title, txt);
    alert("Ditt innlegg er nå publisert.");
    postTitleInput.value = "";
    postTxtInput.value = "";
    postOverlay.style.display = "none";
    await loadPosts();
  } catch (error) {
    "Kunne ikke publisere innlegg:", error;
  }
});

// POSTS

// CREATE POSTS
async function createPost(title, txt) {
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

async function loadPosts() {
  try {
    const posts = await fetchPosts();
    console.log(posts);

    showPosts(posts);
  } catch (error) {
    postContainer.innerHTML = `<li class="error">Noe gikk galt. Prøv igjen.</li>`;
  }
}
// EDIT POSTS

async function editPost(id, data) {
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
    throw new Error(error.message ?? "Kunne ikke slette innlegg.");
  }
}

// DELETE POSTS

async function deletePost(id) {
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

// FETCH POSTS
async function fetchPosts() {
  const response = await fetch(`${BASE_URL}/posts`);
  posts = await response.json();
  return posts;
}

function showPosts(postList) {
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
          <span class="comments-counter muted">${
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
    const commentBox = postArticle.querySelector(".hide-comment");
    const commentBtn = postArticle.querySelector(".comment-btn");
    const postCommentBtn = postArticle.querySelector(".post-comment-btn");
    const exitCommentBtn = postArticle.querySelector(".exit-comment-btn");
    const addComment = postArticle.querySelector(".add-comment");
    const CommentTxt = postArticle.querySelector(".comment");

    // addComment.addEventListener("click", () => {
    //   event.preventDefault();
    //   const newComment = CommentTxt.value.trim();
    // });
    if (post.comments && post.comments.length > 0) {
      post.comments.forEach((comment) => {
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
              alert("Kommentaren er slettet.");
            }
          } catch (error) {
            console.error(error);
          }
        });
        commentsContainer.appendChild(commentElement);
      });
    }

    // OPEN/CLOSE COMMENT-SECTION

    commentBtn.addEventListener("click", () => {
      commentBox.classList.toggle("hide-comment");
    });

    exitCommentBtn.addEventListener("click", () => {
      commentBox.classList.add("hide-comment");
    });

    // REACTIONS
    // TODO: connect to API
    // TODO: create reactions
    // TODO: edit reactions
    // TODO: delete reactions

    const likeBtn = postArticle.querySelectorAll(".like-btn");
    const dislikeBtn = postArticle.querySelector(".dislike-btn");
    const dislikesCounter = postArticle.querySelector(".dislikes-counter");
    const likesCounter = postArticle.querySelector(".likes-counter");
    let likeCount = post.likes;
    let dislikeCount = post.dislikes;

    // function showUpdatedLikes() {
    //   const savedUserLikes = localStorage.getItem(`userLike${post.id}`);
    //   display.textContent =
    //   if (savedUserLikes === "true") {

    //   }
    // }

    // async function updateLikes() {}

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

// TODO: add more posts in API
async function fetchRelatedPosts() {
  try {
    const posts = await fetchPosts();
    const filteredPosts = posts.filter((post) => post.meetupId == meetupId);
    showPosts(filteredPosts);
  } catch (error) {
    "Kunne ikke hente poster:", error;
  }
}

// COMMENTS
// TODO: create comments

// TODO: edit comments
// DELETE COMMENTS
async function deleteComment(postId, commentId) {
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

async function init() {
  await fetchUsers();
  await fetchSingleEvent(meetupId);
  await fetchRelatedPosts();
}

init();
