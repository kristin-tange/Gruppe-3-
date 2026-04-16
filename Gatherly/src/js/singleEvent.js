// KRISTIN TANGE

// FETCH DATA
const BASE_URL = "http://localhost:3000/api";
// TEST-KEY (we need to agree on an api-key for all pages)
const API_KEY = "group3api";

// GET ID FROM WINDOW
const params = new URLSearchParams(window.location.search);
const meetupId = params.get("id");

// EMPTY ARRAYS (filled after fetch)
let users = [];
let posts = [];
let comments = [];

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

    const commentsContainer = postArticle.querySelector(".comment-list");
    const commentBtn = postArticle.querySelector(".comment-btn");
    const postCommentBtn = postArticle.querySelector(".post-comment-btn");
    const exitBtn = postArticle.querySelector(".exit-btn");
    const commentBox = postArticle.querySelector(".hide-comment");

    if (post.comments && post.comments.length > 0) {
      post.comments.forEach((comment) => {
        const commentElement = document.createElement("article");
        commentElement.innerHTML = `
          <div class="comment-container">
          <p class="muted comment-date">${formatDate(comment.created)}</p>
            <div class="first-row">
              <div>
                <img
                  src="/Gatherly/public/assets/img/placeholder-profile.png"
                  alt="profilbilde"
                  class="placeholder-profile"
                  width="32px"
                />
                <span class="user-name">${getUserName(comment.userId)}</span>
                
              </div>
              <p class="comment-text">${comment.comment}</p>
            </div>
            <div class="second-row">
              <button type="button" id="edit-comment" class="comment-btns">
                Rediger
              </button>
              <button type="button" id="delete-comment" class="comment-btns">
                Slett
              </button>
            </div>
          </div>`;
        commentsContainer.appendChild(commentElement);
      });
    } else {
      commentsContainer.innerHTML = `<p>Ingen innlegg å vise ennå.</p>`;
    }

    // OPEN/CLOSE COMMENT-SECTION

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

    const likeBtn = postArticle.querySelector(".like-btn");
    const dislikeBtn = postArticle.querySelector(".dislike-btn");
    const dislikesCounter = postArticle.querySelector(".dislikes-counter");
    const likesCounter = postArticle.querySelector(".likes-counter");
    let likeCount = post.likes;
    let dislikeCount = post.dislikes;

    likeBtn.addEventListener("click", () => {
      likeBtn.classList.toggle("active");
      // localStorage.setItem()
      // localStorage.removeItem()

      if (likeBtn.classList.contains("active")) {
        likeCount++;
      } else {
        likeCount--;
      }
      likesCounter.textContent = likeCount;
    });

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
// function createComments() {}
// TODO: read comments

// TODO: edit comments
// function editComments() {}
// TODO: delete comments
// function delteComments() {}

async function init() {
  await fetchUsers();
  await fetchSingleEvent(meetupId);
  await fetchRelatedPosts();
}

init();
