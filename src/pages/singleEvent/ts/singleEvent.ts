// KRISTIN TANGE

import { fetchSingleEvent } from "./postsApi";
import { loadPosts } from "./posts";
import {
  formatDate,
  formatTime,
  meetupId,
  isLoggedIn,
  currentUser,
  resetEditMode,
  showSuccessMessage,
} from "./helpers";
import type { Meetup } from "../../../ts/types";
import { fetchUsers } from "../../../ts/api";

const heroContainer = document.getElementById(
  "hero-container"
) as HTMLDivElement;
const descriptionContainer = document.getElementById(
  "description-container"
) as HTMLDivElement;
const overlayBtn = document.getElementById(
  "open-overlay-btn"
) as HTMLButtonElement;
const closeOverlayBtn = document.getElementById(
  "close-btn"
) as HTMLButtonElement;
const postOverlay = document.getElementById("post-overlay") as HTMLElement;
const postTitleInput = document.getElementById(
  "new-post-title"
) as HTMLInputElement;

function showSingleEvent(event: Meetup): void {
  const formattedTags = event.tags.join(", ");

  document.title = `${event.name}`;

  heroContainer.innerHTML = `<section role="img" class="event-hero"  aria-label="${
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
            <button class="btn btn-primary active" id="sign-up-btn">Påmelding</button>
        </section>`;

  /* Placeholder "Sign-up" */
  const signUpBtn = document.getElementById("sign-up-btn") as HTMLButtonElement;
  const signUpKey = `${currentUser?.id}signedUp${event.id}`;

  if (localStorage.getItem(signUpKey)) {
    signUpBtn.textContent = "Meld deg av";
    signUpBtn.style.backgroundColor = "grey";
  }

  signUpBtn?.addEventListener("click", () => {
    if (!isLoggedIn) {
      const isConfirmed = confirm(
        "Du må være innlogget for å melde deg på arrangementer. Ønsker du å logge inn?"
      );

      if (!isConfirmed) return;
      window.location.href = "/src/pages/login/login.html";
      return;
    }

    const isSignedUp = localStorage.getItem(signUpKey);

    if (!isSignedUp) {
      const signUpConfirm = confirm(`Vil du melde deg på ${event.name}?`);

      if (!signUpConfirm) {
        return;
      }

      localStorage.setItem(signUpKey, "true");
      signUpBtn.textContent = "Meld deg av";
      signUpBtn.style.backgroundColor = "grey";

      showSuccessMessage(`${currentUser?.email} er nå påmeldt ${event.name}.`);
      return;
    }

    const isConfirmed = confirm(
      "Er du sikker på at du vil melde deg av dette arrangementet?"
    );

    if (!isConfirmed) {
      return;
    }

    localStorage.removeItem(signUpKey);
    signUpBtn.textContent = "Påmelding";
    signUpBtn.style.backgroundColor = "#4a90e2";
    showSuccessMessage(`${currentUser?.email} er nå meldt av ${event.name}.`);
    return;
  });
}

if (overlayBtn) {
  overlayBtn.addEventListener("click", () => {
    if (!isLoggedIn) {
      const isConfirmed = confirm(
        "Du må være innlogget for å opprette innlegg. Ønsker du å logge inn?"
      );

      if (!isConfirmed) return;

      window.location.href = "/src/pages/login/login.html";
      return;
    }

    postOverlay.style.display = "block";
    postTitleInput.focus();
  });
}

if (closeOverlayBtn) {
  closeOverlayBtn.addEventListener("click", () => {
    postOverlay.style.display = "none";
    resetEditMode();
    overlayBtn.focus();
  });
}

async function init(): Promise<void> {
  await fetchUsers();

  const event = await fetchSingleEvent(meetupId);
  showSingleEvent(event);

  await loadPosts();
}

init();
