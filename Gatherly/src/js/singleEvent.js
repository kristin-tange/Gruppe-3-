// KRISTIN TANGE

// HENTE DATA

const BASE_URL = "http://localhost:3000/api";
const API_KEY = "12345";
let users = [];
let posts = [];
const eventId = 1;
let postId = null;
let commentId = null;

const eventTitle = document.getElementById("event-title");
const eventDate = document.getElementById("event-date");
const eventPlace = document.getElementById("event-place");
const eventTime = document.getElementById("event-time");
const eventPrice = document.getElementById("event-price");
const category = document.getElementById("category-tag");
const eventContainer = document.getElementById("event-container");

async function fetchUsers() {
  const response = await fetch(`${BASE_URL}/users`);
  users = await response.json();
  return users;
}

async function fetchSingleEvent() {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");
  const response = await fetch(`${BASE_URL}/meetups/${eventId}`);
  const event = await response.json();

  console.log(event);
  // showSingleEvent(event);
}

// async function fetchPosts() {
//   const response = await fetch(`${BASE_URL}/posts`);
//   posts = await response.json();
//   console.log(posts);
// }

// TODO: function getUserName (innlegg og kommentarer)

// VISE EVENTER/MEETUPS
// function showSingleEvent(event) {
//   eventContainer.innerHTML = ;
// }

// MIDLERTIDIG "PÅMELDING"
//TODO - nice to have: påmeldingsskjema
// TODO - nice to have: vise pop-up med informasjon fra påmelding
// TODO - nice to have: ikon og counter med antall påmeldte

const signUpBtn = document.getElementById("sign-up-btn");

signUpBtn.addEventListener("click", () => {
  alert("Din påmelding er registrert.");
});

// TODO: oppdatere dokumenttittel ut fra hvilket event det er
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
  await fetchPosts();
}

init();
