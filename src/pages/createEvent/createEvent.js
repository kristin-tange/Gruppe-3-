// Jan-Roger Kviteberg

const BASE_URL = "http://localhost:3000/api";
const API_KEY = "group3api";

localStorage.setItem("apiKey", API_KEY);

const createEventForm = document.querySelector("#create-event-form");
const meetupIdInput = document.querySelector("#meetup-id");
const submitEventBtn = document.querySelector("#submit-event-btn");
const resetFormBtn = document.querySelector("#reset-form-btn");
const statusMessage = document.querySelector("#event-status-message");
const meetupsList = document.querySelector("#meetups-list");
const existingEventsSection = document.querySelector(".existing-events-section");

const eventTitleInput = document.querySelector("#event-title");
const summaryInput = document.querySelector("#short-description");
const categoryInput = document.querySelector("#category");
const priceInput = document.querySelector("#price");
const tagsInput = document.querySelector("#tags");
const dateInput = document.querySelector("#date");
const timeInput = document.querySelector("#time");
const locationInput = document.querySelector("#location");
const descriptionInput = document.querySelector("#description");

let meetups = [];

const categoryImages = {
  Academia: {
    image: "/assets/img/categories/academia1.jpg",
    imageAlt: "Academic event",
  },
  Entertainment: {
    image: "/assets/img/categories/entertaintment1.jpg",
    imageAlt: "Entertainment event",
  },
  Professional: {
    image: "/assets/img/categories/professional1.jpg",
    imageAlt: "Professional event",
  },
  Literature: {
    image: "/assets/img/categories/lerature1.jpg",
    imageAlt: "Literature event",
  },
  Technology: {
    image: "/assets/img/categories/technology1.jpg",
    imageAlt: "Technology event",
  },
  Sports: {
    image: "/assets/img/categories/sports1.jpg",
    imageAlt: "Sports event",
  },
};

function isUserLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

function showStatusMessage(message) {
  statusMessage.textContent = message;
}

function showLoginRequiredMessage() {
  statusMessage.innerHTML = `
    Du må være logget inn for å opprette, redigere eller slette arrangementer.
    <br />
    <a href="/src/pages/login/login.html">Gå til innlogging</a>
  `;

  statusMessage.classList.add("login-required-message");
}

function lockCreateEventPage() {
  const formElements = createEventForm.querySelectorAll(
    "input, select, textarea, button"
  );

  formElements.forEach((element) => {
    element.disabled = true;
  });

  showLoginRequiredMessage();

  if (existingEventsSection) {
    existingEventsSection.style.display = "none";
  }
}

function formatDate(dateString) {
  if (!dateString) {
    return "Ukjent dato";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Ugyldig dato";
  }

  return date.toLocaleDateString("no-NO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(dateString) {
  if (!dateString) {
    return "Ukjent tid";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Ugyldig tid";
  }

  return date.toLocaleTimeString("no-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDateValue(dateString) {
  if (!dateString || !dateString.includes("T")) {
    return "";
  }

  return dateString.split("T")[0];
}

function getTimeValue(dateString) {
  if (!dateString || !dateString.includes("T")) {
    return "";
  }

  return dateString.split("T")[1].slice(0, 5);
}

function resetFormMode() {
  meetupIdInput.value = "";
  submitEventBtn.textContent = "Publiser";
  statusMessage.classList.remove("login-required-message");
  showStatusMessage("");
}

async function fetchMeetups() {
  try {
    const response = await fetch(`${BASE_URL}/meetups`);

    if (!response.ok) {
      throw new Error(`Could not fetch meetups. Status: ${response.status}`);
    }

    meetups = await response.json();
    displayMeetups();
  } catch (error) {
    console.error("Error fetching meetups:", error);
    showStatusMessage("Kunne ikke hente arrangementer.");
  }
}

function displayMeetups() {
  meetupsList.innerHTML = "";

  if (meetups.length === 0) {
    meetupsList.innerHTML = "<p>Ingen arrangementer å vise enda.</p>";
    return;
  }

  meetups.forEach((meetup) => {
    const meetupItem = document.createElement("article");
    meetupItem.classList.add("meetup-item");

    meetupItem.innerHTML = `
      <div class="meetup-item-info">
        <h3 class="meetup-item-title">${meetup.name}</h3>
        <p class="meetup-item-meta">
          ${meetup.category} | ${meetup.price || "Ingen pris"} | ${
      meetup.location
    } | ${formatDate(meetup.date)} kl. ${formatTime(meetup.date)}
        </p>
        <p>${meetup.summary}</p>
      </div>

      <div class="meetup-item-actions">
        <button type="button" class="edit-meetup-btn" data-id="${meetup.id}">
          Rediger
        </button>
        <button type="button" class="delete-meetup-btn" data-id="${meetup.id}">
          Slett
        </button>
      </div>
    `;

    meetupsList.appendChild(meetupItem);
  });
}

function getMeetupFromForm(existingMeetup = null) {
  const tags = tagsInput.value
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "");

  const eventDateTime = `${dateInput.value}T${timeInput.value}:00`;

  const selectedCategoryImage = categoryImages[categoryInput.value];

  return {
    name: eventTitleInput.value.trim(),
    summary: summaryInput.value.trim(),
    description: descriptionInput.value.trim(),
    category: categoryInput.value,
    location: locationInput.value.trim(),
    date: eventDateTime,
    tags: tags,
    image: selectedCategoryImage?.image ?? "",
    imageAlt: selectedCategoryImage?.imageAlt ?? "",
    price: priceInput.value,
    created: existingMeetup?.created ?? new Date().toISOString(),
    updated: new Date().toISOString(),
  };
}

async function createMeetup(meetup) {
  try {
    const response = await fetch(`${BASE_URL}/meetups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(meetup),
    });

    if (!response.ok) {
      throw new Error(`Could not create meetup. Status: ${response.status}`);
    }

    const createdMeetup = await response.json();

    console.log("Created meetup:", createdMeetup);
    showStatusMessage("Arrangementet ble opprettet.");

    createEventForm.reset();
    resetFormMode();

    await fetchMeetups();
  } catch (error) {
    console.error("Error creating meetup:", error);
    showStatusMessage("Noe gikk galt. Arrangementet ble ikke opprettet.");
  }
}

async function updateMeetup(id, meetup) {
  try {
    const response = await fetch(`${BASE_URL}/meetups/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(meetup),
    });

    if (!response.ok) {
      throw new Error(`Could not update meetup. Status: ${response.status}`);
    }

    const updatedMeetup = await response.json();

    console.log("Updated meetup:", updatedMeetup);
    showStatusMessage("Arrangementet ble oppdatert.");

    createEventForm.reset();
    resetFormMode();

    await fetchMeetups();
  } catch (error) {
    console.error("Error updating meetup:", error);
    showStatusMessage("Noe gikk galt. Arrangementet ble ikke oppdatert.");
  }
}

async function deleteMeetup(id) {
  try {
    const response = await fetch(`${BASE_URL}/meetups/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Could not delete meetup. Status: ${response.status}`);
    }

    showStatusMessage("Arrangementet ble slettet.");

    await fetchMeetups();
  } catch (error) {
    console.error("Error deleting meetup:", error);
    showStatusMessage("Noe gikk galt. Arrangementet ble ikke slettet.");
  }
}

function fillFormForEdit(id) {
  const meetup = meetups.find((meetup) => meetup.id == id);

  if (!meetup) {
    showStatusMessage("Fant ikke arrangementet som skulle redigeres.");
    return;
  }

  meetupIdInput.value = meetup.id;
  eventTitleInput.value = meetup.name ?? "";
  summaryInput.value = meetup.summary ?? "";
  categoryInput.value = meetup.category ?? "";
  priceInput.value = meetup.price ?? "";
  tagsInput.value = Array.isArray(meetup.tags) ? meetup.tags.join(", ") : "";
  dateInput.value = getDateValue(meetup.date);
  timeInput.value = getTimeValue(meetup.date);
  locationInput.value = meetup.location ?? "";
  descriptionInput.value = meetup.description ?? "";

  submitEventBtn.textContent = "Oppdater";
  showStatusMessage("Du redigerer nå et arrangement.");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function handleCreateEvent(event) {
  event.preventDefault();

  if (!isUserLoggedIn()) {
    lockCreateEventPage();
    return;
  }

  const meetupId = meetupIdInput.value;
  const existingMeetup = meetups.find((meetup) => meetup.id == meetupId);
  const meetup = getMeetupFromForm(existingMeetup);

  console.log("Sending meetup:", meetup);

  if (meetupId) {
    updateMeetup(meetupId, meetup);
  } else {
    createMeetup(meetup);
  }
}

function initCreateEventPage() {
  if (!createEventForm) {
    console.error("Create event form not found.");
    return;
  }

  createEventForm.addEventListener("submit", handleCreateEvent);

  if (resetFormBtn) {
    resetFormBtn.addEventListener("click", resetFormMode);
  }

  if (meetupsList) {
    meetupsList.addEventListener("click", async function (event) {
      const clickedElement = event.target;

      if (!isUserLoggedIn()) {
        lockCreateEventPage();
        return;
      }

      if (clickedElement.classList.contains("delete-meetup-btn")) {
        const meetupId = clickedElement.dataset.id;

        const isConfirmed = confirm(
          "Er du sikker på at du vil slette dette arrangementet?"
        );

        if (isConfirmed) {
          await deleteMeetup(meetupId);
        }
      }

      if (clickedElement.classList.contains("edit-meetup-btn")) {
        const meetupId = clickedElement.dataset.id;
        fillFormForEdit(meetupId);
      }
    });
  }

  if (!isUserLoggedIn()) {
    lockCreateEventPage();
    return;
  }

  fetchMeetups();
}

initCreateEventPage();