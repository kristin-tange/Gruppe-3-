let events = [];

async function fetchEvents() {
  const response = await fetch("/Gatherly/testAPI.json");
  if (!response.ok) throw new Error("Failed to fetch events");
  const data = await response.json();
  events = data.events;
  return events;
}

function displayEvents(list = events) {
  const eventsContainer = document.getElementById("events-container");
  eventsContainer.innerHTML = "";

  list.forEach((event) => {
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
  await fetchEvents();

  displayEvents();
}

function filterEvents(category) {
  const filtered = events.filter((event) => event.category === category);
  displayEvents(filtered);
}

document
  .getElementById("filterAll")
  .addEventListener("click", () => displayEvents());
document
  .getElementById("filterAcademia")
  .addEventListener("click", () => filterEvents("Academia"));
document
  .getElementById("filterEntertainment")
  .addEventListener("click", () => filterEvents("Entertainment"));
document
  .getElementById("filterProfessional")
  .addEventListener("click", () => filterEvents("Professional"));
document
  .getElementById("filterLiterature")
  .addEventListener("click", () => filterEvents("Literature"));
document
  .getElementById("filterTechnology")
  .addEventListener("click", () => filterEvents("Technology"));
document
  .getElementById("filterSports")
  .addEventListener("click", () => filterEvents("Sports"));
document
  .getElementById("filterExample")
  .addEventListener("click", () => filterEvents("Example"));

init();
