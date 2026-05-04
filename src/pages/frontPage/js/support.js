// Adrian Persen

const SUPPORT_BASE_URL = "http://localhost:3000/api";

let editingTicketId = null;

//Henter HTML elementer

const supportBtn = document.getElementById("support-btn");
const supportBox = document.getElementById("support-box");
const closeBtn = document.getElementById("close-support-btn");
const supportForm = document.getElementById("support-form");
const ticketsList = document.getElementById("tickets-list");

/*funksjon for å switche mellom "Send inn saker" og "Mine saker" */

const sendTicketTab = document.getElementById("send-ticket-tab");
const myTicketsTab = document.getElementById("my-tickets-tab");

const sendTicketSection = document.getElementById("send-ticket-section");
const myTicketsSection = document.getElementById("my-tickets-section");

//Markerer Send inn knappen som aktiv
//Fjerner aktiv/styling fra Mine saker

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


supportBtn.addEventListener("click", () => {
    supportBox.classList.add("active");
});

closeBtn.addEventListener("click", () => {
    supportBox.classList.remove("active");
});

window.addEventListener("click", (e) => {
    if (e.target === supportBox) {
        supportBox.classList.remove("active");
    }
});

async function createSupportTicket(ticket) {
    const response = await fetch(`${SUPPORT_BASE_URL}/supportTickets`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer group3api"
        },
        //Gjør JS objektet om til JSON så api-et kan lagre det
        body: JSON.stringify(ticket)
    });

const responseText = await response.text();

console.log("STATUS:", response.status);
console.log("RESPONSE TEXT:", responseText);

    if (!response.ok) {
        throw new Error(`Kunne ikke sende supportsak. Status: ${response.status}. Svar: ${responseText}`);
    }

    return responseText ? JSON.parse(responseText) : null;
}

// funksjon som henter support saker fra apiet 

async function getSupportTickets() {
    const response = await fetch(`${SUPPORT_BASE_URL}/supportTickets`, {
        headers: {
            "Authorization": "Bearer group3api"
        }
    });

    if (!response.ok) {
        throw new Error("Kunne ikke hente supportsaker");
    }

    return await response.json()
}

async function loadTickets() {
    const tickets = await getSupportTickets();

    ticketsList.innerHTML="";

    if (tickets.length == 0) {
        ticketsList.innerHTML ="<p>Ingen saker sendt inn enda.</p>";
        return;
    }


// Går igjennom sakene og forEach lager ett kort for hver sak
    tickets.forEach((ticket) => {
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

        <p class="ticket-message">
        <strong>Melding:</strong> ${ticket.message}
        </p>

        </div>`;
    });

    lucide.createIcons();

    const deleteButtons = document.querySelectorAll(".delete-ticket-btn");
//Går igjennom hver knapp og sletter knapp med riktig id
    deleteButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const id = button.dataset.id;
//Gir en popupp der du må bekrefte at du vil slette saken
            const confirmed = confirm("Er du sikker på at du vil slette saken?");
            if (!confirmed) return;

            await deleteTicket(id);
            await loadTickets();
        });
    });

    const editButtons = document.querySelectorAll(".edit-ticket-btn");

    editButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;

            const ticket = tickets.find((ticket) => ticket.id == id);

            document.getElementById("name").value = ticket.name;
            document.getElementById("email").value = ticket.email;
            document.getElementById("message").value = ticket.message;

            editingTicketId = id;

            sendTicketSection.classList.remove("hidden");
            myTicketsSection.classList.add("hidden");

            sendTicketTab.classList.add("active");
            myTicketsTab.classList.remove("active");

            sendTicketTab.textContent ="Rediger sak"
            document.getElementById("submit-support-btn").textContent = "Lagre endringer";
            
        });
    }); 


}

// sletter supportsak basert på id
async function deleteTicket(id) {
    await fetch(`${SUPPORT_BASE_URL}/supportTickets/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer group3api"
        }
    });
}

//Rediger sak funksjon basert på id

async function updateTicket(id, updatedTicket) {
    await fetch(`${SUPPORT_BASE_URL}/supportTickets/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer group3api"
        },
        body: JSON.stringify(updatedTicket)
    });
}


// Stopper siden fra å refreshe sånn at skjemaet rekker å sende inn
supportForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const newTicket = {
        name: name,
        email: email,
        message: message
    };

    // sender ticket til api-et
    try {

        if (editingTicketId !==null) {
            await updateTicket(editingTicketId, newTicket);
            alert("Saken din er oppdatert!");

            editingTicketId = null;
            document.getElementById("submit-support-btn").textContent = "Send inn";
            sendTicketTab.textContent = "Send inn sak"

        } else {
            const savedTicket = await createSupportTicket(newTicket);
            console.log("LAGRET:", savedTicket);
            alert("Saken din er sendt inn!")
        }

        supportForm.reset();
        supportBox.classList.remove("active");

    } catch (error) {
        console.error("FEIL VED INNSENDING", error);
        alert("Noe gikk galt ved innsending av saken.");
    }



});

