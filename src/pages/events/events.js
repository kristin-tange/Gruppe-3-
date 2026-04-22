// Oscar Wirum

const BASE_URL = "http://localhost:3000/api";
const API_KEY = "group3api";

let meetups = [];

async function fetchMeetups() {
  const response = await fetch(`${BASE_URL}/meetups`);
  if (!response.ok) throw new Error("Failed to fetch meetups");
  const data = await response.json();
  meetups = data;
  return meetups;
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

  list.forEach((event, index) => {
    const card = document.createElement("div");
    card.classList.add("arrangementCard");

    card.innerHTML = `<a href="/Gatherly/src/pages/singleEvent/singleEvent.html?id?${event.id}" class="card-link">
      <div>
        <h2>${event.name}</h2>
        <p>${event.summary}</p>
      </div>
      <div id="filter${event.category}" class="category tag">${event.category}</div>
      <img src="${event.image}" alt=""> </a>
    `;

    colElements[index % columns].appendChild(card);
  });
}

window.addEventListener("resize", () => displayMeetups());

async function init() {
  await fetchMeetups();

  displayMeetups();
}

function filterMeetups(category) {
  const filtered = meetups.filter((event) => event.category === category);
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
