// KRISTIN TANGE

import {
  BASE_URL,
  fetchUsers,
  fetchSingleEvent,
  fetchRelatedPosts,
  createPost,
  updatePost,
} from "./api";
import { loadPosts, showPosts, isLoggedIn, currentUser } from "./posts";
import { formatDate, formatTime, meetupId } from "./helperFunctions";

/* Variables */
const overlayBtn = document.getElementById("open-overlay-btn");
const closeOverlayBtn = document.getElementById("close-btn");
export const postOverlay = document.getElementById("post-overlay");
const postForm = document.getElementById("post-form");
const postHeading = document.getElementById("form-heading");
const postTitleInput = document.getElementById("new-post-title");
const postTxtInput = document.getElementById("new-post-txt");
const publishBtn = document.getElementById("publish-btn");

// FUNCTIONS

// EDIT POST
let editingPostId = null;
export async function editPost(id) {
  const response = await fetch(`${BASE_URL}/posts/${id}`);
  const post = await response.json();
  postTitleInput.value = post.postName;
  postTxtInput.value = post.text;
  if (publishBtn) publishBtn.textContent = "Lagre endringer";
  if (postHeading) postHeading.textContent = "Rediger innlegg";
  postTitleInput.style.backgroundColor = "#FFF8E1";
  postTxtInput.style.backgroundColor = "#FFF8E1";

  editingPostId = id;
}
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
  const signUpKey = `${currentUser.id}signedUp${event.id}`;

  if (localStorage.getItem(signUpKey)) {
    signUpBtn.textContent = "Meld deg av";
  }

  signUpBtn.addEventListener("click", () => {
    const isSignedUp = localStorage.getItem(signUpKey);

    if (!isSignedUp) {
      const signUpConfirm = confirm(`Vil du melde deg på ${event.name}?`);

      if (signUpConfirm) {
        localStorage.setItem(signUpKey, "true");

        signUpBtn.textContent = "Meld deg av";

        alert(`${currentUser.email} er nå påmeldt ${event.name}.`);
      } else {
        return;
      }
    } else {
      const isConfirmed = confirm(
        "Er du sikker på at du vil melde deg av dette arrangementet?"
      );

      if (isConfirmed) {
        localStorage.removeItem(signUpKey);

        signUpBtn.textContent = "Påmelding";
        alert(`${currentUser.email} er nå meldt av ${event.name}.`);
      }
    }
  });
}

/* EVENT-LISTENERS */
overlayBtn.addEventListener("click", () => {
  if (!isLoggedIn) {
    alert("Du må være innlogget for å opprette innlegg.");
    return;
  }
  postOverlay.style.display = "block";
});

closeOverlayBtn.addEventListener("click", () => {
  postOverlay.style.display = "none";
});

postForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let title = postTitleInput.value.trim();
  let txt = postTxtInput.value.trim();

  try {
    if (editingPostId) {
      await updatePost(editingPostId, {
        postName: title,
        text: txt,
      });
      alert("Innlegget er redigert.");
      editingPostId = null;
    } else {
      await createPost(meetupId, title, txt);
      alert("Ditt innlegg er nå publisert.");
    }
    postTitleInput.value = "";
    postTxtInput.value = "";
    postOverlay.style.display = "none";
    await loadPosts();
  } catch (error) {
    console.error("Kunne ikke lagre innlegg:", error);
    alert("Kunne ikke lagre innlegg.");
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
