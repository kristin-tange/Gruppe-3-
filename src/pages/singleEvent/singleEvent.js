// KRISTIN TANGE

import {
  fetchUsers,
  fetchSingleEvent,
  fetchRelatedPosts,
  createPost,
} from "./api";
import { loadPosts, showPosts } from "./posts";
import { formatDate, formatTime, meetupId } from "./helperFunctions";

/* VARIABLES */

/* Post-overlay */
const overlayBtn = document.getElementById("open-overlay-btn");
const closeOverlayBtn = document.getElementById("close-btn");
const postOverlay = document.getElementById("post-overlay");
const postForm = document.getElementById("post-form");
const postTitleInput = document.getElementById("new-post-title");
const postTxtInput = document.getElementById("new-post-txt");
console.log(postForm);

/* RENDER SINGLE-EVENT */
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
  <h3 class="tags">#${formattedTags}</h3>
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

  /* Placeholder "Sign-up" */
  const signUpBtn = document.getElementById("sign-up-btn");
  signUpBtn.addEventListener("click", () => {
    const signUpInput = prompt("Skriv inn fornavn og etternavn: ");
    if (signUpInput !== null && signUpInput.trim() !== "") {
      alert(`${signUpInput} er nå påmeldt ${event.name}.`);
    }
  });
}

/* EVENT-LISTENERS */
overlayBtn.addEventListener("click", () => {
  postOverlay.style.display = "block";
});

closeOverlayBtn.addEventListener("click", () => {
  postOverlay.style.display = "none";
});

postForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  let title = postTitleInput.value.trim();
  let txt = postTxtInput.value.trim();

  try {
    await createPost(meetupId, title, txt);
    alert("Ditt innlegg er nå publisert.");
    postTitleInput.value = "";
    postTxtInput.value = "";
    postOverlay.style.display = "none";
    await loadPosts();
  } catch (error) {
    console.error("Kunne ikke publisere innlegg:", error);
    // Change to error-message
    alert("Kunne ikke publisere innlegg.");
  }
});

async function init() {
  await fetchUsers();

  const event = await fetchSingleEvent(meetupId);
  showSingleEvent(event);

  const relatedPosts = await fetchRelatedPosts(meetupId);
  showPosts(relatedPosts);
}

init();
