// KRISTIN TANGE

// FETCH DATA
const BASE_URL = "http://localhost:3000/api";
const API_KEY = "12345";
let users = [];
let posts = [];
let comments = [];
// const eventId = 1;
// let postId = null;
// let commentId = null;

async function fetchUsers() {
  const response = await fetch(`${BASE_URL}/users`);
  users = await response.json();
  console.log(users);
  return users;
}
// FETCH USERNAME FOR POSTS AND COMMENTS
// FIX: UNDEFINED?
function getUserName(userId) {
  const user = users.find((u) => u.id == userId);
  return user ? user.name : "Ukjent forfatter";
}

// FETCH EVENTS(MEETUPS)
async function fetchSingleEvent() {
  // const params = new URLSearchParams(window.location.search);
  // const eventId = params.get("id");
  const response = await fetch(`${BASE_URL}/meetups/1`);
  const event = await response.json();
  console.log(event);
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
  const formattedDate = formatDate(event.date);
  const formattedTime = formatTime(event.date);
  const formattedCreatedDate = formatDate(event.created);
  const formattedCreatedTime = formatTime(event.created);
  const formattedUpdatedDate = formatDate(event.updated);
  const formattedUpdatedTime = formatTime(event.updated);
  const tags = event.tags;
  const formattedTags = tags.join(", ");

  document.title = `${event.name}`;

  heroContainer.innerHTML = `<section role="img" class="event-hero"  alt="${event.imageAlt}" style="background: linear-gradient(rgba(207, 207, 207, 0.55),rgba(131, 131, 131, 0.55)), url('${event.image}')center / cover no-repeat;">
      <div class="hero-overlay">
        <h1 class="event-title">${event.name}</h1>
        <p class="event-date hero-textbox">${formattedDate}</p>
        <div class="event-info hero-textbox">
          <p class="event-place">${event.location} /</p>
          <p class="event-time">kl. ${formattedTime} /</p>
          <p class="event-price">${event.price} kr</p>
        </div>
        <div id="filter${event.category}" class="category tag hero-tag">${event.category}</div>
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
  Opprettet: <span id="created">${formattedCreatedDate} kl. ${formattedCreatedTime}</span> <br />Sist
            oppdatert:
            <span id="updated">${formattedUpdatedDate} kl. ${formattedUpdatedTime}</span>
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

overlayBtn.addEventListener("click", () => {
  postOverlay.style.display = "block";
});

closeOverlayBtn.addEventListener("click", () => {
  postOverlay.style.display = "none";
});

// POSTS
// TODO: create POSTS
// TODO: edit posts
// TODO: delete posts

// FETCH POSTS
// FIX: fetch related posts from eventId (add more posts in api?)
async function fetchPosts() {
  const response = await fetch(`${BASE_URL}/posts`);
  posts = await response.json();
  console.log(posts);
}

function showPosts(postList) {
  const postContainer = document.getElementById("post-container");
  postContainer.innerHTML = "";
  if (postList.length === 0) {
    postContainer.innerHTML = `<p> Ingen innlegg å vise. </p>`;
    return;
  }

  postList.forEach((post) => {
    const postArticle = document.createElement("article");
    postArticle.className = "published-post";
    postArticle.innerHTML = `
    <div class="post-grid">
    <div class="first-row">
      <div class="user">
        <img
        src="/Gatherly/public/assets/img/placeholder-profile.png"
        alt="profilbilde"
        class="placeholder-profile"
        width="32px"
        />
        <span class="user-name">${getUserName(post.userId)}</span>
      </div>
        <h4 class="post-name">${post.postName}</h4>
      </div>
   
      <div class="post-btns">
        <button type="button" id="edit-post" class="post-icons">
          <img src="/Gatherly/public/assets/icons/edit.png" width="16px" />
        </button>
        <button type="button" id="delete-post" class="post-icons">
          <img src="/Gatherly/public/assets/icons/delete.png" width="16px" />
        </button>
      </div>

  <p class="post-text">
  ${post.text}
  </p>
  <div class="reaction-btns">
    <div class="likes">
      <button class="post-icons like-btn" type="button">
        <img src="/Gatherly/public/assets/icons/like.png" width="20px" />
      </button>
      <span class="likes-counter muted">${post.likes}</span>
    </div>
    <div class="dislikes">
        <button class="post-icons dislike-btn" type="button">
          <img src="/Gatherly/public/assets/icons/dislike.png" width="20px" />
        </button>
        <span class="dislikes-counter muted">${post.dislikes}</span>
     </div>
      <div class="comments">
        <button class="post-icons comment-btn" type="button">
          <img src="/Gatherly/public/assets/icons/comment.png" width="20px" />
        </button>
        <span class="comments-counter muted">${post.comments.length}</span>
      </div>
    </div>
  </div>
  
  <section class="comment-section">
    <form class="hide-comment">
      <div class="comment-container">
        <div class="post-comments">
          <div>
            <img
              src="/Gatherly/public/assets/img/placeholder-profile.png"
              alt="profilbilde"
              class="placeholder-profile"
              width="32px"
            />
            <span class="user-name">${getUserName(post.userId)}</span>
          </div>
          <textarea
            class="comment"
            name="kommentar"
            rows="4"
            cols="30"
            placeholder="Legg til kommentar..."
          ></textarea>
        </div>
        <div class="btns">
          <button class="post-comment-btn btn btn-primary" type="submit">Send</button>
          <button class="exit-btn btn btn-secondary" type="button">
            Avbryt
          </button>
        </div>
      </div>
    </form>
    <div class="comment-list">
    </div>
  </section>
`;
    postContainer.appendChild(postArticle);
  });

  // OPEN/CLOSE COMMENT-SECTION

  const commentBtn = document.querySelector(".comment-btn");
  const postCommentBtn = document.querySelector(".post-comment-btn");
  const exitBtn = document.querySelector(".exit-btn");
  const commentBox = document.querySelector(".hide-comment");

  commentBtn.addEventListener("click", () => {
    commentBox.classList.toggle("hide-comment");
  });

  exitBtn.addEventListener("click", () => {
    commentBox.classList.add("hide-comment");
  });

  // REACTIONS
  // TODO: connect to API
  // TODO: create reactions
  // TODO: edit reactions
  // TODO: delete reactions

  const likeBtn = document.querySelector(".like-btn");
  const dislikeBtn = document.querySelector(".dislike-btn");
  const dislikesCounter = document.querySelector(".dislikes-counter");
  const likesCounter = document.querySelector(".likes-counter");
  let likeCount = 12;
  let dislikeCount = 0;

  likeBtn.addEventListener("click", () => {
    likeBtn.classList.toggle("active");

    if (likeBtn.classList.contains("active")) {
      likeCount++;
    } else {
      likeCount--;
    }
    likesCounter.textContent = likeCount;
  });

  dislikeBtn.addEventListener("click", () => {
    dislikeBtn.classList.toggle("active");

    if (dislikeBtn.classList.contains("active")) {
      dislikeCount++;
    } else {
      dislikeCount--;
    }
    dislikesCounter.textContent = dislikeCount;
  });
}

// COMMENTS
// TODO: create comments
// function createComments() {}
// TODO: read comments
// function showComments() {}
// TODO: edit comments
// function editComments() {}
// TODO: delete comments
// function delteComments() {}

async function init() {
  await fetchUsers();
  await fetchSingleEvent();
  await fetchPosts();
  showPosts(posts);
}

init();
