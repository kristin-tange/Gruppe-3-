// KRISTIN TANGE

// HENTE DATA

const BASE_URL = "http://localhost:3000/api";
const API_KEY = "12345";
let users = [];
// let posts = [];
// const eventId = 1;
// let postId = null;
// let commentId = null;

async function fetchUsers() {
  const response = await fetch(`${BASE_URL}/users`);
  users = await response.json();
  console.log(users);
  return users;
}
// TODO: function getUserName (innlegg og kommentarer)
function getUserName(userId) {
  const user = users.find((u) => u.id == userId);
  return user ? user.name : "Ukjent forfatter";
}

async function fetchSingleEvent() {
  // const params = new URLSearchParams(window.location.search);
  // const eventId = params.get("id");
  const response = await fetch(`${BASE_URL}/meetups/1`);
  const event = await response.json();
  console.log(event);
  showSingleEvent(event);
}

// VISE EVENTER/MEETUPS

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
          <p class="event-price">${event.tags[4]}</p>
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

  // MIDLERTIDIG "PÅMELDING"
  const signUpBtn = document.getElementById("sign-up-btn");
  signUpBtn.addEventListener("click", () => {
    alert("Din påmelding er registrert.");
  });

  //TODO - nice to have: påmeldingsskjema
  // TODO - nice to have: vise pop-up med informasjon fra påmelding
  // TODO - nice to have: ikon og counter med antall påmeldte
}

// async function fetchPosts() {
//   const response = await fetch(`${BASE_URL}/posts`);
//   posts = await response.json();
//   console.log(posts);
// }

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

publishBtn.addEventListener("click", () => {
  alert("Ditt innlegg er publisert.");
});

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

async function init() {
  await fetchUsers();
  await fetchSingleEvent();
  // await fetchPosts();
}

init();
