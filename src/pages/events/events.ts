// Oscar Wirum
import type { Meetup, Folder } from "../../ts/types";
import { BASE_URL, API_KEY } from "../../ts/config";


let meetups: Meetup[] = [];
let folders: Folder[] = [];

const loggedIn = localStorage.getItem("isLoggedIn") === "true";
let currentUser = null;
let userId: number | null = null;

if (loggedIn) {
  const storedUser = localStorage.getItem("currentUser");
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    userId = currentUser.id;
  }
}

import { fetchMeetups } from "../../ts/api";

async function fetchFolders() {
  try {
    if (!loggedIn) {
      folders = [];
      return;
    }

    const response = await fetch(`${BASE_URL}/folders?userId=${userId}`);
    if (!response.ok) {
      console.warn("Folders API not ready yet");
      folders = [];
      return;
    }
    folders = await response.json();
  } catch (err) {
    console.warn("Error fetching folders:", err);
    folders = [];
  }
}

function getColumnCount() {
  const width = window.innerWidth;
  if (width < 768) return 1;
  if (width < 980) return 2;
  if (width < 1314) return 3;
  else return 4;
}

function displayMeetups(list = meetups) {
  

  if (selectionMode && activeFolderId !== null) {
    const folder = folders.find(f => f.id === activeFolderId);
    if(!folder) return;
    list = list.filter(event => !folder.events.includes(event.id));
  }

  const eventsContainer = document.getElementById("events-container") as HTMLDivElement | null;
  if (!eventsContainer) return;
  eventsContainer.innerHTML = "";

  const columns = getColumnCount();
  const colElements: HTMLDivElement[] = [];

  for (let i = 0; i < columns; i++) {
    const col = document.createElement("div") as HTMLDivElement;
    col.classList.add("column");
    colElements.push(col);
    eventsContainer.appendChild(col);
  }

  // FOLDER CARD

  let folderCard = null;

  if (loggedIn) {
    folderCard = document.createElement("div");
    folderCard.classList.add("arrangementCard", "folderCard");

    folderCard.innerHTML = `
    <div class="folder-card-content card-content">
      <h2>Mapper</h2>
      <p>Organiser dine eventer</p>
      <button id="createFolderBtn" class="btn">+ Ny Mappe</button>

      <div id="folderButtons">
        ${folders
          .map(
            folder => `
              <div class="folderRow">
                <button class="folderFilterBtn btn" data-folder="${folder.id}">
                  ${folder.name}
                </button>
                <button class="deleteFolderBtn btn" data-folder="${folder.id}">
                  ✕
                </button>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `;

    colElements[0].appendChild(folderCard);
  }
  // MEETUP CARDS

  list.forEach((event, index) => {
    const card = document.createElement("div");
    card.classList.add("arrangementCard");

    card.innerHTML = `
  <a href="/src/pages/singleEvent/singleEvent.html?id=${event.id}" class="card-link">
    <div class="card-content">
      <h2>${event.name}</h2>
      <p>${event.summary}</p>
    </div>
    
  </a>

  <div class="card-top-row ">
    <div id="filter${event.category}" class="card-content category tag">${event.category}</div>

    ${
      activeFolderId !== null && !selectionMode
        ? `<button class="removeFromFolderBtn removeFromFolderBtn btn" data-id="${event.id}">Fjern</button>`
        : ""
    }
  </div>
  <img src="${event.image}" alt="">
`;

    colElements[(index + 1) % columns].appendChild(card);

    card.dataset.eventId = String(event.id);


    // Selection mode (velge flere meetups)
    card.addEventListener("click", e => {
      if (!selectionMode) return;
      e.preventDefault();

      const id = Number(card.dataset.eventId);

      if (selectedMeetups.has(id)) {
        selectedMeetups.delete(id);
        card.classList.remove("selected");
      } else {
        selectedMeetups.add(id);
        card.classList.add("selected");
      }
    });
  });

  // LEGG TIL MEETUPS I MAPPE
  if (!folderCard) return;
  if (activeFolderId !== null && !selectionMode) {
    const addBtn = document.createElement("button");
    addBtn.id = "addMeetupsBtn";
    addBtn.textContent = "Legg til meetups i denne mappen";
    folderCard.appendChild(addBtn);
  }

  // LAGRE VALGTE MEETUPS

  if (selectionMode) {
    const okBtn = document.createElement("button");
    okBtn.id = "confirmSelectionBtn";
    okBtn.textContent = "Lagre valgte meetups";
    folderCard.appendChild(okBtn);
  }
}

window.addEventListener("resize", () => displayMeetups());

async function init() {
  meetups = await fetchMeetups();
  await fetchFolders();
  displayMeetups();
}

document.addEventListener("click", async e => {
  const target = e.target as HTMLElement;
  if (!(target instanceof HTMLElement)) return;
  if (target.id === "createFolderBtn") {
    const name = prompt("Mappe navn;");
    if (!name) return;

    const response = await fetch(`${BASE_URL}/folders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        name,
        events: [],
        userId: userId,
      }),
    });

    const newFolder = await response.json();
    folders.push(newFolder);

    displayMeetups();
  }
});

async function updateFolder(folderId: number, updatedData: Partial<Folder>) {
  const response = await fetch(`${BASE_URL}/folders/${folderId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) throw new Error("Failed to update folder");
  return await response.json();
}

async function deleteFolder(folderId: number) {
  const response = await fetch(`${BASE_URL}/folders/${folderId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) throw new Error("Kunne ikke slette mappe");
}

document.addEventListener("change", async e => {
  const target = e.target as HTMLElement;
  if (!(target instanceof HTMLSelectElement)) return;
  if (target.id === "folderSelect") {
    const folderId = Number(target.value);
    const eventId = Number(prompt("Hvilket meetup vil du legge til i mappen?"));

    if (!eventId) return;

    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;

    const updatedEvents = [...new Set([...(folder.events || []), eventId])];

    const updatedFolder = await updateFolder(folderId, {
      events: updatedEvents,
    });

    folder.events = updatedFolder.events;

    alert("Meetup lagt til i mappen!");
  }
});

document.addEventListener("click", async e => {
  const target = e.target as HTMLElement;
  if (!(target instanceof HTMLElement)) return;

  if (target.classList.contains("removeFromFolderBtn")) {
    e.preventDefault();
    e.stopPropagation();

    const eventId = Number(target.dataset.id);

    if (activeFolderId === null) return;

    const folder = folders.find(f => f.id === activeFolderId);
    if (!folder) return;

    folder.events = folder.events.filter(id => id !== eventId);

    await updateFolder(activeFolderId, { events: folder.events });

    filterByFolder(activeFolderId);
  }
});

function filterByFolder(folderId: number) {
  const folder = folders.find(f => f.id === folderId);
  if (!folder || !folder.events) return;

  const filtered = meetups.filter(event => folder.events.includes(event.id));
  displayMeetups(filtered);
}

let activeFolderId: number | null = null;
let selectionMode: boolean = false;
let selectedMeetups: Set<number> = new Set();

document.addEventListener("click", e => {
  const target = e.target as HTMLElement;
  if (!(target instanceof HTMLElement)) return;
  if (target.classList.contains("folderFilterBtn")) {
    activeFolderId = Number(target.dataset.folder);
    filterByFolder(activeFolderId);
  }
});

document.addEventListener("click", e => {
  const target = e.target as HTMLElement;
  if (!(target instanceof HTMLElement)) return;
  if (target.id === "addMeetupsBtn") {
    selectionMode = true;
    selectedMeetups.clear();
    displayMeetups();
  }
});

document.addEventListener("click", async e => {
  const target = e.target as HTMLElement;
  if (!(target instanceof HTMLElement)) return;
  if (target.id === "confirmSelectionBtn") {
    if (activeFolderId === null) return;

    const folder = folders.find(f => f.id === activeFolderId);
    if (!folder) return;
    const updatedEvents = [
      ...new Set([...(folder.events || []), ...selectedMeetups]),
    ];

    await updateFolder(activeFolderId, { events: updatedEvents });

    folder.events = updatedEvents;

    selectionMode = false;
    selectedMeetups.clear();

    filterByFolder(activeFolderId);
  }
});

document.addEventListener("click", async e => {
  const target = e.target as HTMLElement;
  if (!(target instanceof HTMLElement)) return;
  if (target.classList.contains("deleteFolderBtn")) {
    e.stopPropagation();

    const folderId = Number(target.dataset.folder);
    const folder = folders.find(f => f.id === folderId);

    if (!folder) return;

    if (!confirm(`Vil du slette "${folder.name}"?`)) return;

    await deleteFolder(folderId);

    folders = folders.filter(f => f.id !== folderId);

    displayMeetups();
  }
});

function filterMeetups(category: string) {
  const filtered = meetups.filter(event => event.category === category);
  displayMeetups(filtered);
}

document.getElementById("filterAll")!.addEventListener("click", () => {
  activeFolderId = null;
  selectionMode = false;
  displayMeetups();
});
document.getElementById("filterAcademia")!.addEventListener("click", () => {
  activeFolderId = null;
  selectionMode = false;
  filterMeetups("Academia");
});
document.getElementById("filterEntertainment")!.addEventListener("click", () => {
  activeFolderId = null;
  selectionMode = false;
  filterMeetups("Entertainment");
});
document.getElementById("filterProfessional")!.addEventListener("click", () => {
  activeFolderId = null;
  selectionMode = false;
  filterMeetups("Professional");
});
document.getElementById("filterLiterature")!.addEventListener("click", () => {
  activeFolderId = null;
  selectionMode = false;
  filterMeetups("Literature");
});
document.getElementById("filterTechnology")!.addEventListener("click", () => {
  activeFolderId = null;
  selectionMode = false;
  filterMeetups("Technology");
});
document.getElementById("filterSports")!.addEventListener("click", () => {
  activeFolderId = null;
  selectionMode = false;
  filterMeetups("Sports");
});

init();
