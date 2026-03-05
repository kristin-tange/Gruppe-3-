const createBtn = document.getElementById("create-btn");
const closeBtn = document.getElementById("close-btn");
const postOverlay = document.getElementById("post-overlay");

createBtn.addEventListener("click", () => {
  postOverlay.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  postOverlay.style.display = "none";
});

const commentBtn = document.querySelectorAll("comment-btn");
const postBtn = document.querySelectorAll("post-btn");
const exitBtn = document.querySelectorAll("exit-btn");
const commentBox = document.querySelectorAll(".comment-box");

commentBtn.addEventListener("click", () => {
  commentBox.classList.toggle("comment-box");
});

exitBtn.addEventListener("click", () => {
  commentBox.classList.add("comment-box");
});

// REAKSJONER
//Like-btn: like/unlike innlegg
//Dislike-btn: dislike/undislike innlegg

const likeBtn = document.querySelectorAll("like-btn");
const dislikeBtn = document.querySelectorAll("dislike-btn");
const likesCounter = document.querySelectorAll("likes-counter");
const dislikesCounter = document.querySelectorAll("dislikes-counter");

likeBtn.addEventListener("click", () => {});
// KOMMENTARER
// Send-btn: poste kommentar på innlegg

const commentsCounter = document.querySelectorAll("comments-counter");
postBtn;

// ANNEN FUNKSJONALITET (SENERE)
// Alert ved trykk på påmeldings-knapp
// Edit-btn: Redigere innlegg
//Delete-btn: Slette innlegg
