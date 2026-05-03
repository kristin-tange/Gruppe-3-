// siva

document.addEventListener("DOMContentLoaded", loadProfile);

const API_URL = "http://localhost:3000/api/users";
const API_KEY = "group3api";

// Load profile on page load
async function loadProfile() {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const isNewUser = !user.id;

  const inputs = document.querySelectorAll("#accountForm input, #accountForm textarea");
  const passwordContainer = document.getElementById("passwordGroup");
 
  const profileImage = document.getElementById("profileImage");

  // Existing user → disable inputs
  if (!isNewUser) {
    inputs.forEach(input => input.disabled = true);

    //  Hide password field+ input together
    if (passwordContainer) {
      passwordContainer.style.display = "none";
    
   }
  }
  // Load existing user data
  if (user && user.id) {
    try {
      const res = await fetch(`${API_URL}/${user.id}`, {
        headers: {
          "Authorization": `Bearer ${API_KEY}`
        }
      });

      const freshUser = await res.json();

      // Fill form fields (NO PASSWORD)
      document.getElementById("usernameTitle").textContent =
        `Velkommen ${freshUser.firstName}!`;

      document.getElementById("firstname").value = freshUser.firstName || "";
      document.getElementById("lastname").value = freshUser.lastName || "";
      document.getElementById("email").value = freshUser.email || "";
      document.getElementById("description").value = freshUser.description || "";

      // Gender
      document.querySelectorAll('input[name="gender"]').forEach(radio => {
        radio.checked = radio.value === freshUser.gender;
      });


      const gender = freshUser.gender?.toLowerCase().trim();

      if (gender === "mann") {
        profileImage.src = "/assets/img/profilepictureman.png";
      } else if (gender === "kvinne") {
        profileImage.src = "/assets/img/profilepicturewoman.jpeg";
      }

    } catch (err) {
      alert("Kunne ikke laste profil: " + err);
    }
  }

  // Gender change handler
  document.querySelectorAll('input[name="gender"]').forEach(radio => {

    // Disable for existing user
    if (!isNewUser) {
      radio.disabled = true;
    }
    
    radio.addEventListener("change", () => {
      if (radio.value === "mann") {
        profileImage.src = "/assets/img/profilepictureman.png";
      } else if (radio.value === "kvinne") {
        profileImage.src = "/assets/img/profilepicturewoman.jpeg";
        
      }
    });
  });
}


// Enable edit mode
document.getElementById("editbtn").addEventListener("click", () => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const isNewUser = !user.id;

  document.querySelectorAll("#accountForm input, #accountForm textarea")
    .forEach(input => input.disabled = false);

  // Keep gender disabled for existing users
  if (!isNewUser) {
    document.querySelectorAll('input[name="gender"]').forEach(radio => {
      radio.disabled = true;
    });
  }
});


// Save profile
document.getElementById("accountForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const isNewUser = !user.id;

  const passwordInput = document.getElementById("password");
  const password = passwordInput ? passwordInput.value.trim() : "";

  // Validate password ONLY for new users
  if (isNewUser && password.length < 8) {
    alert("Passord må være minst 8 tegn");
    return;
  }

  const updateUser = {
    firstName: document.getElementById("firstname").value,
    lastName: document.getElementById("lastname").value,
    email: document.getElementById("email").value,
    description: document.getElementById("description").value,
    gender: document.querySelector('input[name="gender"]:checked')?.value,
    password: isNewUser ? password : undefined 
  };

  try {
    let res;

    if (isNewUser) {
      // Create user
      res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify(updateUser)
      });
    } else {
      // Update user
      res = await fetch(`${API_URL}/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify(updateUser)
      });
    }

    const savedUser = await res.json();
    localStorage.setItem("currentUser", JSON.stringify(savedUser));

    // Disable again
    document.querySelectorAll("#accountForm input, #accountForm textarea")
      .forEach(input => input.disabled = true);

    alert("Profil lagret!");

  } catch (err) {
    alert("Kunne ikke lagre profil: " + err);
  }
});


// Delete account
document.getElementById("deletebtn")?.addEventListener("click", async () => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  if (!user.id) return;

  if (confirm("Er du sikker på at du vil slette kontoen?")) {
    try {
      await fetch(`${API_URL}/${user.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${API_KEY}` }
      });

      localStorage.removeItem("currentUser");

      alert("Konto slettet!");
      window.location.href = "login.html";

    } catch (err) {
      alert("Kunne ikke slette konto: " + err);
    }
  }
});