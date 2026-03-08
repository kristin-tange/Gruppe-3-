let events = [
  {
    id: 1,
    name: "Example Event",
    date: "2026-02-04",
    location: "Example Location",
    description: "Example description of the event.",
    tags: ["example", "event"],
    category: "Example",
    image: "/Gatherly/public/assets/img/example.jpg",
    imageAlt: "Example Image",
    created: "2026-01-01T12:00:00Z",
    updated: "2026-01-15T12:00:00Z",
  },
];

function displayEvents() {
  const eventsContainer = document.getElementById("events-container");
  eventsContainer.innerHTML = "";

  events.forEach((event) => {
    const div = document.createElement("div");

    div.innerHTML = `
    <div class="arrangementCard">
    <div>
      <h2>${event.name}</h2>
      <p>${event.description}</p>
    </div>
    <div class="category filter${event.category} tag">${event.category}</div>
    <img src="${event.image}" alt="">
    </div>
    `;
    eventsContainer.appendChild(div);
  });
}

displayEvents();
