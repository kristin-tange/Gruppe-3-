// Adrian Persen

// API-url og API-nøkkel
import {BASE_URL, API_KEY} from "../../../ts/config"
import type {User, SupportTicket} from "../../../ts/types"

declare const lucide: any;

//Holder styr på om brukeren redigerer en sak eller lager en ny
//Hvis den er null, betyr det at brukeren lager ny sak
//Forteller TS at verdien kan være et tall eller null
let editingTicketId: number | null = null;

//Henter HTML elementene som brukes i support-boksen
const supportBtn = document.getElementById("support-btn") as HTMLButtonElement | null;
const closeBtn = document.getElementById("close-support-btn") as HTMLButtonElement | null;
const supportBox = document.getElementById("support-box") as HTMLElement | null;
const supportForm = document.getElementById("support-form") as HTMLFormElement | null;
const ticketsList = document.getElementById("tickets-list") as HTMLElement | null;

const sendTicketTab = document.getElementById("send-ticket-tab") as HTMLElement | null;
const myTicketsTab = document.getElementById("my-tickets-tab") as HTMLElement | null;

const sendTicketSection = document.getElementById("send-ticket-section") as HTMLElement | null;
const myTicketsSection = document.getElementById("my-tickets-section") as HTMLElement | null;

//Hjelpefunksjoner for innlogging
//Henter brukeren som er logget inn
//Henter bruker fra local storage
function getCurrentUser(): User | null {
    const user = localStorage.getItem("currentUser");
//Hvis ingen bruker finnes: returner null
    if (!user) {
        return null;
    }
//Hvis bruker finnes: gjør teksten om til JS-objekt
    return JSON.parse(user);
}
//Sjekker om brukeren er logget inn
function userIsLoggedIn(): boolean {
  return localStorage.getItem("isLoggedIn") === "true";
}

//Lager en melding som vises hvis brukeren ikke er logget inn
function getLoginMessage(): string {
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
if (
    sendTicketTab &&
    myTicketsTab &&
    sendTicketSection &&
    myTicketsSection
) {
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
}

// Åpner supportboksen og sjekker om bruker er logget inn
if (
    supportBtn &&
    supportBox &&
    supportForm &&
    sendTicketSection &&
    closeBtn
) {
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
}

//Funksjon som sender en ny support sak til API-et

async function createSupportTicket(ticket: SupportTicket): Promise<void> {
  const response = await fetch(`${BASE_URL}/supportTickets`, {
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
}

//Funksjon som henter support saker fra apiet

async function getSupportTickets(): Promise<SupportTicket[]> {
  const response = await fetch(`${BASE_URL}/supportTickets`, {
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

async function loadTickets(): Promise<void> {

    if (!ticketsList) {
        return;
    }

  const tickets = await getSupportTickets();

  if (!userIsLoggedIn()) {
    ticketsList.innerHTML = getLoginMessage();
    return;
  }

  const currentUser = getCurrentUser();

  if (!currentUser) {
    ticketsList.innerHTML = getLoginMessage();
    return;
  }

  const myTickets = tickets.filter((ticket: SupportTicket) => {
    return Number(ticket.userId) === Number(currentUser.id);
  });

  ticketsList.innerHTML = "";

  if (myTickets.length === 0) {
    ticketsList.innerHTML = "<p>Ingen saker sendt inn enda.</p>";
    return;
  }

  // Går igjennom sakene og forEach lager ett kort for hver sak
  myTickets.forEach((ticket: SupportTicket) => {
    ticketsList.innerHTML += `
        <div class = "ticket-card">

        <div class="ticket-header">

        <div class="ticket-info">

        <div class="ticket-row">
        <i data-lucide="user"></i>

        <div>
        <p class="ticket-label">Navn:</p>
        <p class="ticket-value">${ticket.name}</p>
        </div>
        </div>

        </div>

        <div class="ticket-actions">
        <button class="edit-ticket-btn" data-id="${ticket.id}"><i data-lucide="pencil"></i></button>
        <button class="delete-ticket-btn" data-id="${ticket.id}"><i data-lucide="trash-2"></i></button>
        </div>

        </div>

          <div class="ticket-row">
        <i data-lucide="mail"></i>

        <div>
        <p class="ticket-label">E-post:</p>
        <p class="ticket-value">${ticket.email}</p>
        </div>
        </div>

       
        <div class="ticket-row">
        <i data-lucide="file-text"></i>

        <div>
        <p class="ticket-label">Tittel:</p>
        <p class="ticket-value">${ticket.title}</p>
        </div>
        </div>

       <div class="ticket-row">
       <i data-lucide="message-square"></i>

       <div class="ticket-message-wrap">
       <p class="ticket-label">Melding:</p>
       <p class="ticket-message">${ticket.message}</p>
       </div>
       </div>

        </div>`;
  });

  lucide.createIcons();

  //Henter alle sletteknappene
  //Forteller TS at hver button er en knapp
  const deleteButtons = document.querySelectorAll<HTMLButtonElement>(".delete-ticket-btn");

  //Går igjennom hver knapp og sletter knapp med riktig id
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const id = Number(button.dataset.id);

      //Gir en popup der brukeren må bekrefte sletting
      const confirmed = confirm("Er du sikker på at du vil slette saken?");
      if (!confirmed) return;

      await deleteTicket(id);
      await loadTickets();
    });
  });

  //Henter alle redigeringsknappene
  //Forteller TS at hver button er en knapp
  const editButtons = document.querySelectorAll<HTMLButtonElement>(".edit-ticket-btn");

//Forteller TS at elementene finnes
  if (
    sendTicketSection &&
    myTicketsSection &&
    sendTicketTab &&
    myTicketsTab
  ) {

  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;

      //Finner saken som matcher id-en til knappen
      const ticket = myTickets.find((ticket: SupportTicket) => ticket.id === Number(id));

      if (!ticket) {
        return;
      }

      //Fyller skjemaet med eksisterende informasjon
      const titleInput = document.getElementById("title") as HTMLInputElement;
      const messageInput = document.getElementById("message") as HTMLTextAreaElement;

      titleInput.value = ticket.title;
      messageInput.value = ticket.message;

      //Lagrer id-en til saken som redigeres
      editingTicketId = Number(id);

      //Bytter tilbake til "send inn sak" tabben
      sendTicketSection.classList.remove("hidden");
      myTicketsSection.classList.add("hidden");

      //Oppdaterer aktiv tab
      sendTicketTab.classList.add("active");
      myTicketsTab.classList.remove("active");

      //Endrer tekst så bruker kan se at saken redigeres
      sendTicketTab.textContent = "Rediger sak";

      const submitSupportBtn = document.getElementById("submit-support-btn") as HTMLButtonElement | null;

      if (submitSupportBtn) {
        submitSupportBtn.textContent = "Lagre endringer";
      }
     
    });
  });
}
}
// sletter supportsak basert på id
async function deleteTicket(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/supportTickets/${id}`, {
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

async function updateTicket(id: number, updatedTicket: SupportTicket): Promise<void> {
  const response = await fetch(`${BASE_URL}/supportTickets/${id}`, {
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
if (supportForm) {
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
//Henter elementet og forteller TS hva slags element det er
  const titleInput = document.getElementById("title") as HTMLInputElement;
  const messageInput = document.getElementById("message") as HTMLTextAreaElement;

  const title = titleInput.value.trim();
  const message = messageInput.value.trim();

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

      const submitSupportBtn = document.getElementById("submit-support-btn");

      if (submitSupportBtn) {
        submitSupportBtn.textContent = "Send inn";
      }

      if (sendTicketTab) {
        sendTicketTab.textContent = "Send inn sak";
      }
    } else {
      await createSupportTicket(newTicket);
      alert("Saken din er sendt inn!");
    }

    supportForm.reset();

    if (supportBox) {
        supportBox.classList.remove("active");
    }

  } catch (error) {
    console.error("FEIL VED INNSENDING", error);
    alert("Noe gikk galt ved innsending av saken.");
  }
});
}
