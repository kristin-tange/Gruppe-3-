// KRISTIN TANGE

// HENTE DATA

const BASE_URL = "http://localhost:3000/api";
const API_KEY = "12345";
let users = [];
let events = [];
let posts = [];
let postId = null;
let commentId = null;

async function fetchUsers() {
  const response = await fetch(`${BASE_URL}/users`);
  users = await response.json();
  console.log(users);
}

fetchUsers();

async function fetchEvents() {
  const response = await fetch(`${BASE_URL}/meetups`);
  events = await response.json();
  console.log(events);
}

fetchEvents();

async function fetchPosts() {
  const response = await fetch(`${BASE_URL}/posts`);
  posts = await response.json();
  console.log(posts);
}

fetchPosts();

// VISE DATA

function showPosts(postList) {
  const container = document.getElementById("posts-list");
  container.innerHTML = "";

  // if (postList.length === 0) {
  //   container.innerHTML = `<p>Ingen innlegg å vise</p>`;
  //   return;
  // }
  postList.forEach((article) => {
    const post = document.createElement("article");
    post.className = "published-post";
    post.innerHTML = `<div class="first-row">
    <div>
      <img
        src="/Gatherly/public/assets/img/placeholder-profile.png"
        alt="profilbilde"
        class="placeholder-profile"
        width="32px"
      />
      <span class="user-name">Brukernavn</span>
    </div>
    <h4 class="post-name">${posts.postName}</h4>
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
    ${posts.text}
  </p>


  
  <div class="reaction-btns">
    <div class="likes">
      <button class="post-icons like-btn" type="button">
        <img src="/Gatherly/public/assets/icons/like.png" width="20px" />
      </button>
      <span class="likes-counter muted">12</span>
    </div>
    <div class="dislikes">
      <button class="post-icons dislike-btn" type="button">
        <img src="/Gatherly/public/assets/icons/dislike.png" width="20px" />
      </button>
      <span class="dislikes-counter muted">0</span>
    </div>
    <div class="comments">
      <button class="post-icons comment-btn" type="button">
        <img src="/Gatherly/public/assets/icons/comment.png" width="20px" />
      </button>
      <span class="comments-counter muted">0</span>
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
            <span class="user-name">Brukernavn</span>
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
          <button class="post-btn btn btn-primary" type="submit">Send</button>
          <button class="exit-btn btn btn-secondary" type="button">
            Avbryt
          </button>
        </div>
      </div>
    </form>

    <h5>Kommentarer</h5>

    <!-- KOMMENTARFELT -->

    <!-- Her kommer postede kommentarer -->
    <div class="comments-list">
      <!-- EKSEMPELKOMMENTAR -->
      <article class="published-comment">
        <div class="comment-container">
          <div class="first-row">
            <div>
              <img
                src="/Gatherly/public/assets/img/placeholder-profile.png"
                alt="profilbilde"
                class="placeholder-profile"
                width="32px"
              />
              <span class="user-name">Brukernavn</span>
            </div>
            <p class="comment-text">Enig! Vi ses der.</p>
          </div>
          <div class="second-row">
            <button type="button" id="edit-comment" class="comment-btns">
              Rediger
            </button>
            <button type="button" id="delete-comment" class="comment-btns">
              Slett
            </button>
          </div>
        </div>
      </article>
    </div>
  </section>
`;
    container.appendChild(post);
  });
}

showPosts(posts);

// ÅPNE OG LUKKE OVERLAY: INNLEGG
const overlayBtn = document.getElementById("open-overlay-btn");
const closeOverlayBtn = document.getElementById("close-btn");
const postOverlay = document.getElementById("post-overlay");

overlayBtn.addEventListener("click", () => {
  postOverlay.style.display = "block";
});

closeOverlayBtn.addEventListener("click", () => {
  postOverlay.style.display = "none";
});

// ÅPNE OG LUKKE KOMMENTARFELT

const commentBtn = document.querySelector(".comment-btn");
const postBtn = document.querySelector(".post-btn");
const exitBtn = document.querySelector(".exit-btn");
const commentBox = document.querySelector(".hide-comment");

commentBtn.addEventListener("click", () => {
  commentBox.classList.toggle("hide-comment");
});

exitBtn.addEventListener("click", () => {
  commentBox.classList.add("hide-comment");
});

// REAKSJONER
// OBS: må kobles til API med flere brukere og innlegg senere

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

// INNLEGG
// post-btn
const postName = document.getElementById("postName");
const postTxt = document.getElementById("postTxt");
const publishBtn = document.getElementById("publish-btn");

function createPost() {
  const newPost = document.createElement("article");
  newPost;
}

// KOMMENTARER
// Send-btn: poste kommentar på innlegg

// TODO: Opprette, hente, redigere, slette innlegg
// TODO: Opprette, hente, redigere, slette reaksjoner
// TODO: Opprette, hente, redigere, slette kommentarer

// ANNEN FUNKSJONALITET (SENERE)
// TODO: Alert ved trykk på påmeldings-knapp
