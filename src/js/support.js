// Adrian Persen

function isLoggedIn() {
    return localStorage.getItem("loggedIn") === "true";
}

const SUPPORT_BASE_URL = "http://localhost:3000/api";

const supportBtn = document.getElementById("support-btn");
const supportBox = document.getElementById("support-box");
const closeBtn = document.getElementById("close-support-btn");
const supportForm = document.getElementById("support-form");

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

supportForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!isLoggedIn()) {
        alert("Du må være logget inn for å kontakte support.");
        return;
    }

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const newTicket = {
        name: name,
        email: email,
        message: message
    };

    try {
        const savedTicket = await createSupportTicket(newTicket);
        console.log("LAGRET:", savedTicket);

        alert("Saken din er sendt inn!")
        supportForm.reset();
        supportBox.classList.remove("active");
    } catch (error) {
        console.error("FEIL VED INNSENDING", error);
        alert("Noe gikk galt ved innsending av saken.");
    }



})