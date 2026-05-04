// Oscar Wirum

const BASE_URL = "http://localhost:3000/api";
const API_KEY = "group3api";

localStorage.setItem("apiKey", API_KEY);

let meetups = [];
let folders = [];

async function fetchMeetups() {
  const response = await fetch(`${BASE_URL}/meetups`);
  if (!response.ok) throw new Error("Failed to fetch meetups");
  const data = await response.json();
  meetups = data;
  return meetups;
}

async function fetchFolders() {
  try {
    const response = await fetch(`${BASE_URL}/folders`);
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
  const eventsContainer = document.getElementById("events-container");
  eventsContainer.innerHTML = "";

  const columns = getColumnCount();
  const colElements = [];

  for (let i = 0; i < columns; i++) {
    const col = document.createElement("div");

    col.classList.add("column");
    colElements.push(col);
    eventsContainer.appendChild(col);
  }

  const folderCard = document.createElement("div");
  folderCard.classList.add("arrangementCard", "folderCard");
  folderCard.innerHTML = `
  <div class="folder-card-content">
  <h2>Mapper</h2>
  <p>Organiser dine eventer</p>
  <button id="createFolderBtn">+ Ny Mappe</button>
  <select name="Mapper" id="folderSelect">
    <option value="" disabled selected hidden>Velg mappe</option>
    ${folders.map(folder => `<option value="${folder.id}">${folder.name}</option>`).join("")}
  </select>
  </div>
  `;
  colElements[0].appendChild(folderCard);

  list.forEach((event, index) => {
    const card = document.createElement("div");
    card.classList.add("arrangementCard");

    card.innerHTML = `<a href="/src/pages/singleEvent/singleEvent.html?id=${event.id}" class="card-link">
      <div>
        <h2>${event.name}</h2>
        <p>${event.summary}</p>
      </div>
      <div id="filter${event.category}" class="category tag">${event.category}</div>
      <img src="${event.image}" alt=""> </a>
    `;

    colElements[(index + 1) % columns].appendChild(card);
  });
}

window.addEventListener("resize", () => displayMeetups());

async function init() {
  await fetchMeetups();
  await fetchFolders();
  displayMeetups();
}

document.addEventListener("click", async e => {
  if (e.target.id === "createFolderBtn") {
    const name = prompt("Mappe navn;");
    if (!name) return;

    const response = await fetch(`${BASE_URL}/folders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ name }),
    });

    const newFolder = await response.json();
    folders.push(newFolder);

    displayMeetups();
  }
});

function filterMeetups(category) {
  const filtered = meetups.filter(event => event.category === category);
  displayMeetups(filtered);
}

document
  .getElementById("filterAll")
  .addEventListener("click", () => displayMeetups());
document
  .getElementById("filterAcademia")
  .addEventListener("click", () => filterMeetups("Academia"));
document
  .getElementById("filterEntertainment")
  .addEventListener("click", () => filterMeetups("Entertainment"));
document
  .getElementById("filterProfessional")
  .addEventListener("click", () => filterMeetups("Professional"));
document
  .getElementById("filterLiterature")
  .addEventListener("click", () => filterMeetups("Literature"));
document
  .getElementById("filterTechnology")
  .addEventListener("click", () => filterMeetups("Technology"));
document
  .getElementById("filterSports")
  .addEventListener("click", () => filterMeetups("Sports"));

init();
