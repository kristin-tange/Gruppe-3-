//siva
import { BASE_URL, API_KEY } from "../../../ts/config";
import type { User, LoginUser } from "../../../ts/types";

const API_URL = `${BASE_URL}/users`;

// Load page
document.addEventListener("DOMContentLoaded", loadProfile);

// Get current user from localStorage
function getCurrentUser(): User | null {
  const data = localStorage.getItem("currentUser");
  return data ? JSON.parse(data) : null;
}

// Load profile
async function loadProfile(): Promise<void> {

  const user = getCurrentUser();
  const isNewUser = !user?.id;

  const image = document.getElementById("image") as HTMLImageElement;

  const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    "#accountForm input, #accountForm textarea"
  );

  const passwordContainer = document.getElementById("passwordGroup") as HTMLElement;

  // Existing user
  if (!isNewUser) {
    inputs.forEach(input => {
      input.disabled = true;
    });

    if (passwordContainer) {
      passwordContainer.style.display = "none";
    }
    const saveBtn = document.getElementById("savebtn") as HTMLButtonElement;

    saveBtn.textContent = "Oppdater profil";

  }

  // Gender radios
  document.querySelectorAll<HTMLInputElement>('input[name="gender"]').forEach(radio => {

    radio.disabled = !isNewUser;

    radio.addEventListener("change", () => {

      if (radio.value === "male") {
        image.src = "/assets/img/profilepictureman.png";
      } else if (radio.value === "female") {
        image.src = "/assets/img/profilepicturewoman.jpeg";
      }
    });
  });

  if (!user?.id) return;

  try {

    const res = await fetch(`${API_URL}/${user.id}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`
      }
    });

    if (!res.ok) throw new Error("Kunne ikke hente bruker");

    const existingUser: User = await res.json();

    const title = document.getElementById("usernameTitle");

    if (title) {
      title.textContent = `Velkommen ${existingUser.firstName}!`;
    }

    (document.getElementById("firstname") as HTMLInputElement).value =
      existingUser.firstName || "";

    (document.getElementById("lastname") as HTMLInputElement).value =
      existingUser.lastName || "";

    (document.getElementById("username") as HTMLInputElement).value =
      existingUser.username || "";

    (document.getElementById("email") as HTMLInputElement).value =
      existingUser.email || "";

    (document.getElementById("description") as HTMLTextAreaElement).value =
      existingUser.description || "";
     
    document.querySelectorAll<HTMLInputElement>('input[name="gender"]').forEach(radio => {
      radio.checked = radio.value === existingUser.gender; 
    });

    image.src = existingUser.image || "/assets/img/profilepictureman.png";

  } catch (err) {
    alert("Kunne ikke laste profil: " + err);
  }
}

// Edit profile
document.getElementById("editbtn")?.addEventListener("click", () => {

  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    "#accountForm input, #accountForm textarea"
  ).forEach(input => {
    input.disabled = false;
  });

  document.querySelectorAll<HTMLInputElement>('input[name="gender"]').forEach(radio => {
    radio.disabled = false;
  });
});

// Save profile
document.getElementById("accountForm")?.addEventListener("submit", async (e: Event) => {

  e.preventDefault();

  const user = getCurrentUser();
  const isNewUser = !user?.id;

  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const password = passwordInput?.value.trim();

  const image = document.getElementById("image") as HTMLImageElement;

  const selectedGender = document.querySelector<HTMLInputElement>(
    'input[name="gender"]:checked'
  )?.value;
const url: URL = new URL(image.src);

const relativePath: string = url.pathname;
  // USER OBJECT (FIXED TYPE)
  const userData: Partial<User> = {

    firstName: (document.getElementById("firstname") as HTMLInputElement).value,

    lastName: (document.getElementById("lastname") as HTMLInputElement).value,

    username: (document.getElementById("username") as HTMLInputElement).value,

    email: (document.getElementById("email") as HTMLInputElement).value,

    description: (document.getElementById("description") as HTMLTextAreaElement).value,

    gender: selectedGender || "",

    image: relativePath
  };

  try {

    let res: Response;

    // CREATE USER
    if (isNewUser) {

      if (!password || password.length < 8) {
        alert("Passord må være minst 8 tegn.");
        return;
      }

      const createUserData = {
        ...userData,
        password
      };

      res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`
        },
        body: JSON.stringify(createUserData)
      });

      if (!res.ok) throw new Error("Kunne ikke opprette konto");

      alert("Konto opprettet! Vennligst logg inn");

      localStorage.removeItem("currentUser");
      window.location.href = "login.html";
      return;
    }

    // UPDATE USER
    res = await fetch(`${API_URL}/${user!.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify(userData)
    });

    if (!res.ok) throw new Error("Kunne ikke oppdatere profil");

    const savedUser: User = await res.json();

    const safeUser: LoginUser = {
      id: savedUser.id,
     
    };

    localStorage.setItem("currentUser", JSON.stringify(safeUser));

    document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      "#accountForm input, #accountForm textarea"
    ).forEach(input => {
      input.disabled = true;
    });

    document.querySelectorAll<HTMLInputElement>('input[name="gender"]').forEach(radio => {
      radio.disabled = true;
    });

    alert("Profil oppdatert!");

  } catch (err) {
    alert("Kunne ikke lagre profil: " + err);
  }
});

// Delete account
document.getElementById("deletebtn")?.addEventListener("click", async () => {

  const user = getCurrentUser();

  if (!user?.id) return;

  const confirmDelete = confirm("Er du sikker på at du vil slette kontoen?");
  if (!confirmDelete) return;

  try {

    await fetch(`${API_URL}/${user.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${API_KEY}`
      }
    });

    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");

    alert("Konto slettet!");
    window.location.href = "login.html";

  } catch (err) {
    alert("Kunne ikke slette konto: " + err);
  }
});