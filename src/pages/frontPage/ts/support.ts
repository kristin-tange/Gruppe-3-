// Adrian Persen

import { BASE_URL, API_KEY } from "../../../ts/config";
import type { User, SupportTicket } from "../../../ts/types";
import { users, fetchUsers } from "../../../ts/api";

declare const lucide: any;

let editingTicketId: number | null = null;

const supportBtn = document.getElementById(
  "support-btn",
) as HTMLButtonElement | null;
const closeBtn = document.getElementById(
  "close-support-btn",
) as HTMLButtonElement | null;
const supportBox = document.getElementById("support-box") as HTMLElement | null;
const supportForm = document.getElementById(
  "support-form",
) as HTMLFormElement | null;
const ticketsList = document.getElementById(
  "tickets-list",
) as HTMLElement | null;

const sendTicketTab = document.getElementById(
  "send-ticket-tab",
) as HTMLElement | null;
const myTicketsTab = document.getElementById(
  "my-tickets-tab",
) as HTMLElement | null;

const sendTicketSection = document.getElementById(
  "send-ticket-section",
) as HTMLElement | null;
const myTicketsSection = document.getElementById(
  "my-tickets-section",
) as HTMLElement | null;

function getCurrentUser(): User | null {
  const user = localStorage.getItem("currentUser");

  if (!user) {
    return null;
  }

  return JSON.parse(user);
}

function userIsLoggedIn(): boolean {
  return localStorage.getItem("isLoggedIn") === "true";
}

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

if (sendTicketTab && myTicketsTab && sendTicketSection && myTicketsSection) {
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

if (supportBtn && supportBox && supportForm && sendTicketSection && closeBtn) {
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

async function createSupportTicket(ticket: SupportTicket): Promise<void> {
  const response = await fetch(`${BASE_URL}/supportTickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },

    body: JSON.stringify(ticket),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Kunne ikke sende supportsak. Status: ${response.status}. Svar: ${responseText}`,
    );
  }
}

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

async function loadTickets(): Promise<void> {
  if (!ticketsList) {
    return;
  }

  const tickets = await getSupportTickets();
  await fetchUsers();

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

  myTickets.forEach((ticket: SupportTicket) => {
    ticketsList.innerHTML += `
        <div class = "ticket-card">

        <div class="ticket-header">

        <div class="ticket-info">

        <div class="ticket-row">
        <i data-lucide="user"></i>

        <div>
        <p class="ticket-label">Navn:</p>
        <p class="ticket-value">${getUserFullName(ticket.userId)}</p>
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

  const deleteButtons =
    document.querySelectorAll<HTMLButtonElement>(".delete-ticket-btn");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const id = Number(button.dataset.id);

      const confirmed = confirm("Er du sikker på at du vil slette saken?");
      if (!confirmed) return;

      await deleteTicket(id);
      await loadTickets();
    });
  });

  const editButtons =
    document.querySelectorAll<HTMLButtonElement>(".edit-ticket-btn");

  if (sendTicketSection && myTicketsSection && sendTicketTab && myTicketsTab) {
    editButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.id;

        const ticket = myTickets.find(
          (ticket: SupportTicket) => ticket.id === Number(id),
        );

        if (!ticket) {
          return;
        }

        const titleInput = document.getElementById("title") as HTMLInputElement;
        const messageInput = document.getElementById(
          "message",
        ) as HTMLTextAreaElement;

        titleInput.value = ticket.title;
        messageInput.value = ticket.message;

        editingTicketId = Number(id);

        sendTicketSection.classList.remove("hidden");
        myTicketsSection.classList.add("hidden");

        sendTicketTab.classList.add("active");
        myTicketsTab.classList.remove("active");

        sendTicketTab.textContent = "Rediger sak";

        const submitSupportBtn = document.getElementById(
          "submit-support-btn",
        ) as HTMLButtonElement | null;

        if (submitSupportBtn) {
          submitSupportBtn.textContent = "Lagre endringer";
        }
      });
    });
  }
}

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

async function updateTicket(
  id: number,
  updatedTicket: SupportTicket,
): Promise<void> {
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

function getUserFullName(userId: number): string {
  const user = users.find((u) => u.id === userId);

  return user ? `${user.firstName} ${user.lastName}` : "Ukjent";
}

if (supportForm) {
  supportForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!userIsLoggedIn()) {
      const isConfirmed = confirm(
        "Du må være innlogget for å sende inn en sak. Ønsker du å logge inn?",
      );

      if (!isConfirmed) return;

      window.location.href = "/src/pages/login/login.html";
      return;
    }

    const currentUser = getCurrentUser();

    if (!currentUser) {
      alert("Fant ikke brukerdata");
      return;
    }

    await fetchUsers();
    const fullName = getUserFullName(currentUser.id);

    const titleInput = document.getElementById("title") as HTMLInputElement;
    const messageInput = document.getElementById(
      "message",
    ) as HTMLTextAreaElement;

    const title = titleInput.value.trim();
    const message = messageInput.value.trim();

    const newTicket = {
      title: title,
      name: fullName,
      email: currentUser.email,
      message: message,
      userId: currentUser.id,
    };

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
