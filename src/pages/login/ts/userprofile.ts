// API
//siva
const API_URL = "http://localhost:3000/api/users";
const API_KEY = "group3api";

// User interface
interface User {
  id?: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  description: string;
  gender?: string;
  image?: string;
  password?: string;
}

// Load page
document.addEventListener("DOMContentLoaded", loadProfile);

// Get current user from localStorage
function getCurrentUser(): User {
  return JSON.parse(localStorage.getItem("currentUser") || "{}");
}

// Load profile
async function loadProfile(): Promise<void> {

  const user = getCurrentUser();
  const isNewUser = !user.id;

  const image = document.getElementById("profileImage") as HTMLImageElement;

  const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    "#accountForm input, #accountForm textarea"
  );

  const passwordContainer = document.getElementById("passwordGroup") as HTMLElement;

  // Existing user
  if (!isNewUser) {

    // Disable inputs
    inputs.forEach(input => {
      input.disabled = true;
    });

    // Hide password
    if (passwordContainer) {
      passwordContainer.style.display = "none";
    }
  }

  // Gender radios
  document.querySelectorAll<HTMLInputElement>('input[name="gender"]').forEach(radio => {

    // Disable for existing user
    radio.disabled = !isNewUser;

    // Change image when gender changes
    radio.addEventListener("change", () => {

      if (radio.value === "mann") {
        image.src = "/assets/img/profilepictureman.png";
      }

      else if (radio.value === "kvinne") {
        image.src = "/assets/img/profilepicturewoman.jpeg";
      }
    });
  });

  // Stop if new user
  if (!user.id) return;

  try {

    // Get user from API
    const res = await fetch(`${API_URL}/${user.id}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`
      }
    });

    const existingUser: User = await res.json();

    // Welcome text
    const title = document.getElementById("usernameTitle");

    if (title) {
      title.textContent = `Velkommen ${existingUser.firstName}!`;
    }

    // Fill inputs
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

    // Gender
    const gender = existingUser.gender?.trim().toLowerCase();

    document.querySelectorAll<HTMLInputElement>('input[name="gender"]').forEach(radio => {
      radio.checked = radio.value === gender;
    });

    //  image
    image.src =
      existingUser.image ||
      "/assets/img/profilepictureman.png";

  } catch (err) {
    alert("Kunne ikke laste profil: " + err);
  }
}

// Edit profile
document.getElementById("editbtn")?.addEventListener("click", () => {

  // Enable inputs
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    "#accountForm input, #accountForm textarea"
  ).forEach(input => {
    input.disabled = false;
  });

  // Enable gender radios
  document.querySelectorAll<HTMLInputElement>('input[name="gender"]').forEach(radio => {
    radio.disabled = false;
  });
});

// Save profile
document.getElementById("accountForm")?.addEventListener("submit", async (e: Event) => {

  e.preventDefault();

  const user = getCurrentUser();
  const isNewUser = !user.id;

  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const password = passwordInput?.value.trim();

  const image = document.getElementById("image") as HTMLImageElement;

  // Selected gender
  const selectedGender = document.querySelector<HTMLInputElement>(
    'input[name="gender"]:checked'
  )?.value;

  // User object
  const updateUser: User = {

    firstName: (document.getElementById("firstname") as HTMLInputElement).value,

    lastName: (document.getElementById("lastname") as HTMLInputElement).value,

    username: (document.getElementById("username") as HTMLInputElement).value,

    email: (document.getElementById("email") as HTMLInputElement).value,

    description: (document.getElementById("description") as HTMLTextAreaElement).value,

    gender: selectedGender,

    image: image.src
  };

  try {

    let res: Response;

    // CREATE USER
    if (isNewUser) {

      if (!password || password.length < 8) {
        alert("Passord må være minst 8 tegn.");
        return;
      }

      updateUser.password = password;

      res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`
        },
        body: JSON.stringify(updateUser)
      });

      if (!res.ok) {
        throw new Error("Kunne ikke opprette konto");
      }

      alert("Konto opprettet!");

      localStorage.removeItem("currentUser");

      window.location.href = "login.html";

      return;
    }

    // UPDATE USER
    res = await fetch(`${API_URL}/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify(updateUser)
    });

    if (!res.ok) {
      throw new Error("Kunne ikke oppdatere profil");
    }

    // Updated user
    const savedUser: User = await res.json();

    // Save in localStorage


    const safeUser: User = {
  id: savedUser.id,
  firstName: savedUser.firstName,
  lastName: savedUser.lastName,
  username: savedUser.username,
  email: savedUser.email,
  description: savedUser.description,
  gender: savedUser.gender,
  image: savedUser.image
};
//Save safe user only
localStorage.setItem("currentUser", JSON.stringify(safeUser));
   

    // Disable inputs again
    document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      "#accountForm input, #accountForm textarea"
    ).forEach(input => {
      input.disabled = true;
    });

    // Disable radios again
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

  if (!user.id) return;

  const confirmDelete = confirm("Er du sikker på at du vil slette kontoen?");

  if (!confirmDelete) return;

  try {

    await fetch(`${API_URL}/${user.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${API_KEY}`
      }
    });

    // Remove localStorage
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");

    alert("Konto slettet!");

    // Go login page
    window.location.href = "login.html";

  } catch (err) {
    alert("Kunne ikke slette konto: " + err);
  }
});