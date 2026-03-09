const createBtn = document.getElementById("create-btn");
const closeBtn = document.getElementById("close-btn");
const postOverlay = document.getElementById("post-overlay");

createBtn.addEventListener("click", () => {
  postOverlay.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  postOverlay.style.display = "none";
});

const commentBtn = document.querySelector(".comment-btn");
const postBtn = document.querySelector(".post-btn");
const exitBtn = document.querySelector(".exit-btn");
const commentBox = document.querySelector(".comment-box");

commentBtn.addEventListener("click", () => {
  commentBox.classList.toggle("comment-box");
});

exitBtn.addEventListener("click", () => {
  commentBox.classList.add("comment-box");
});

// REAKSJONER
// TODO: reaction-btns: reagere/avreagere på innlegg
// TODO: oppdatere counter med antall reaksjoner

const likeBtn = document.querySelector(".like-btn");
const dislikeBtn = document.querySelector(".dislike-btn");
const dislikesCounter = document.querySelector(".dislikes-counter");
const likesCounter = document.querySelector(".likes-counter");
let likeCount = 12;
let dislikeCount = 0;

// OBS: må kobles til API med flere brukere og innlegg senere

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

// KOMMENTARER
// Send-btn: poste kommentar på innlegg

// const commentsCounter = document.querySelectorAll("comments-counter");
// postBtn;

// ANNEN FUNKSJONALITET (SENERE)
// Alert ved trykk på påmeldings-knapp
// Edit-btn: Redigere innlegg
//Delete-btn: Slette innlegg
