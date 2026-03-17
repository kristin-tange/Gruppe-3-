const BASE_URL = "http://localhost:3000/api";
const API_KEY = "1000";

let meetups = [];

async function fetchMeetups() {
  const response = await fetch(`${BASE_URL}/meetups`);
  if (!response.ok) throw new Error("Failed to fetch meetups");
  const data = await response.json();
  meetups = data;
  return meetups;
}

function displayMeetups(list = meetups) {
  const eventsContainer = document.getElementById("events-container");
  eventsContainer.innerHTML = "";

  list.forEach(event => {
    const div = document.createElement("div");

    div.innerHTML = `
    <div class="arrangementCard">
    <div>
      <h2>${event.name}</h2>
      <p>${event.description}</p>
    </div>
    <div id="filter${event.category}" class="category tag">${event.category}</div>
    <img src="${event.image}" alt="">
    </div>
    `;
    eventsContainer.appendChild(div);
  });
}

async function init() {
  await fetchMeetups();

  displayMeetups();
}

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
document
  .getElementById("filterExample")
  .addEventListener("click", () => filterMeetups("Example"));

init();
