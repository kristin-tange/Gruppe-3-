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

// ANNEN FUNKSJONALITET (SENERE)
// Alert ved trykk på påmeldings-knapp
// Edit-btn: Redigere innlegg
//Delete-btn: Slette innlegg
