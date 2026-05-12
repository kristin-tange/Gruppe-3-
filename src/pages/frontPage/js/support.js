// Adrian Persen

// API-url og API-nøkkel
const SUPPORT_BASE_URL = "http://localhost:3000/api";
const API_KEY = "group3api";

//Holder styr på om brukeren redigerer en sak eller lager en ny
//Hvis den er null, betyr det at brukeren lager ny sak
let editingTicketId = null;

//Henter HTML elementene som brukes i support-boksen
const supportBtn = document.getElementById("support-btn");
const supportBox = document.getElementById("support-box");
const closeBtn = document.getElementById("close-support-btn");
const supportForm = document.getElementById("support-form");
const ticketsList = document.getElementById("tickets-list");

const sendTicketTab = document.getElementById("send-ticket-tab");
const myTicketsTab = document.getElementById("my-tickets-tab");

const sendTicketSection = document.getElementById("send-ticket-section");
const myTicketsSection = document.getElementById("my-tickets-section");

//Hjelpefunksjoner for innlogging
//Henter brukeren som er logget inn
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}
//Sjekker om brukeren er logget inn
function userIsLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

//Lager en melding som vises hvis brukeren ikke er logget inn
function getLoginMessage() {
  return `
    <div class="support-login-message">
    <p>Du må være logget inn for å bruke support.</p>
    <a href="/src/pages/login/login.html" class="support-login-btn">
    Logg inn
    </a>
    </div>
    `;
}

//Bytter mellom "Send inn sak" og "Mine saker"
sendTicketTab.addEventListener("click", () => {
  sendTicketSection.classList.remove("hidden");
  myTicketsSection.classList.add("hidden");

  sendTicketTab.classList.add("active");
  myTicketsTab.classList.remove("active");
});

myTicketsTab.addEventListener("click", async () => {
  myTicketsSection.classList.remove("hidden");
  sendTicketSection.classList.add("hidden");

  myTicketsTab.classList.add("active");
  sendTicketTab.classList.remove("active");

  await loadTickets();
});

// Åpner supportboksen og sjekker om bruker er logget inn

supportBtn.addEventListener("click", () => {
  supportBox.classList.add("active");

  if (!userIsLoggedIn()) {
    supportForm.classList.add("hidden");

    if (!document.querySelector(".support-login-message")) {
      sendTicketSection.innerHTML += getLoginMessage();
    }
    return;
  }

  supportForm.classList.remove("hidden");

  const loginMessage = document.querySelector(".support-login-message");

  if (loginMessage) {
    loginMessage.remove();
  }
});

closeBtn.addEventListener("click", () => {
  supportBox.classList.remove("active");
});

window.addEventListener("click", (e) => {
  if (e.target === supportBox) {
    supportBox.classList.remove("active");
  }
});

//Funksjon som sender en ny support sak til API-et

async function createSupportTicket(ticket) {
  const response = await fetch(`${SUPPORT_BASE_URL}/supportTickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    //Gjør JS objektet om til JSON så api-et kan lagre det
    body: JSON.stringify(ticket),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Kunne ikke sende supportsak. Status: ${response.status}. Svar: ${responseText}`,
    );
  }

  return responseText ? JSON.parse(responseText) : null;
}

//Funksjon som henter support saker fra apiet

async function getSupportTickets() {
  const response = await fetch(`${SUPPORT_BASE_URL}/supportTickets`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error("Kunne ikke hente supportsaker");
  }

  return await response.json();
}

//Funksjon som henter og viser sakene som tilhører innlogget bruker

async function loadTickets() {
  const tickets = await getSupportTickets();

  if (!userIsLoggedIn()) {
    ticketsList.innerHTML = getLoginMessage();
    return;
  }

  const currentUser = getCurrentUser();

  const myTickets = tickets.filter((ticket) => {
    return Number(ticket.userId) === Number(currentUser.id);
  });

  ticketsList.innerHTML = "";

  if (myTickets.length == 0) {
    ticketsList.innerHTML = "<p>Ingen saker sendt inn enda.</p>";
    return;
  }

  // Går igjennom sakene og forEach lager ett kort for hver sak
  myTickets.forEach((ticket) => {
    ticketsList.innerHTML += `
        <div class = "ticket-card">

        <div class="ticket-header">

        <div class="ticket-info">
        <p><strong>Navn:</strong> ${ticket.name}</p>
        <p><strong>E-post:</strong> ${ticket.email}</p>
        </div>

        <div class="ticket-actions">
        <button class="edit-ticket-btn" data-id="${ticket.id}"><i data-lucide="pencil"></i></button>
        <button class="delete-ticket-btn" data-id="${ticket.id}"><i data-lucide="trash-2"></i></button>
        </div>

        </div>

        <p class="ticket-title">
        <strong>Tittel:</strong> ${ticket.title}
        </p>

        <p class="ticket-message">
        <strong>Melding:</strong> ${ticket.message}
        </p>

        </div>`;
  });

  lucide.createIcons();

  //Henter alle sletteknappene
  const deleteButtons = document.querySelectorAll(".delete-ticket-btn");

  //Går igjennom hver knapp og sletter knapp med riktig id
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.id;

      //Gir en popup der brukeren må bekrefte sletting
      const confirmed = confirm("Er du sikker på at du vil slette saken?");
      if (!confirmed) return;

      await deleteTicket(id);
      await loadTickets();
    });
  });

  //Henter alle redigeringsknappene
  const editButtons = document.querySelectorAll(".edit-ticket-btn");

  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;

      //Finner saken som matcher id-en til knappen
      const ticket = myTickets.find((ticket) => ticket.id == id);

      //Fyller skjemaet med eksisterende informasjon
      document.getElementById("title").value = ticket.title;
      document.getElementById("message").value = ticket.message;

      //Lagrer id-en til saken som redigeres
      editingTicketId = id;

      //Bytter tilbake til "send inn sak" tabben
      sendTicketSection.classList.remove("hidden");
      myTicketsSection.classList.add("hidden");

      //Oppdaterer aktiv tab
      sendTicketTab.classList.add("active");
      myTicketsTab.classList.remove("active");

      //Endrer tekst så bruker kan se at saken redigeres
      sendTicketTab.textContent = "Rediger sak";
      document.getElementById("submit-support-btn").textContent =
        "Lagre endringer";
    });
  });
}

// sletter supportsak basert på id
async function deleteTicket(id) {
  const response = await fetch(`${SUPPORT_BASE_URL}/supportTickets/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error("Kunne ikke slette supportsak");
  }
}

//Oppdaterer supportsak basert på id

async function updateTicket(id, updatedTicket) {
  const response = await fetch(`${SUPPORT_BASE_URL}/supportTickets/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(updatedTicket),
  });

  if (!response.ok) {
    throw new Error("Kunne ikke oppdatere supportsak");
  }
}

// Stopper siden fra å refreshe sånn at skjemaet rekker å sende inn
supportForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  //Sjekker om bruker er logget inn / Saken blir bare sendt inn om bruker er innlogget
  if (!userIsLoggedIn()) {
    const isConfirmed = confirm(
      "Du må være innlogget for å sende inn en sak. Ønsker du å logge inn?",
    );

    if (!isConfirmed) return;

    window.location.href = "/src/pages/login/login.html";
    return;
  }

  //Henter informasjon om brukeren som er logget inn
  const currentUser = getCurrentUser();

  if (!currentUser) {
    alert("Fant ikke brukerdata");
    return;
  }

  const fullName = `${currentUser.firstName} ${currentUser.lastName}`;

  const title = document.getElementById("title").value.trim();
  const message = document.getElementById("message").value.trim();

  //Lager objektet som skal sendes til API-et
  const newTicket = {
    title: title,
    name: fullName,
    email: currentUser.email,
    message: message,
    userId: currentUser.id,
  };

  //Sender eller oppdaterer saken i API-et
  try {
    if (editingTicketId !== null) {
      await updateTicket(editingTicketId, newTicket);
      alert("Saken din er oppdatert!");

      editingTicketId = null;
      document.getElementById("submit-support-btn").textContent = "Send inn";
      sendTicketTab.textContent = "Send inn sak";
    } else {
      await createSupportTicket(newTicket);
      alert("Saken din er sendt inn!");
    }

    supportForm.reset();
    supportBox.classList.remove("active");
  } catch (error) {
    console.error("FEIL VED INNSENDING", error);
    alert("Noe gikk galt ved innsending av saken.");
  }
});
