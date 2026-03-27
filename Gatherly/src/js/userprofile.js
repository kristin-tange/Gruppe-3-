// siva

document.addEventListener("DOMContentLoaded", loadProfile);

const API_URL = "http://localhost:3000/api/users";
const API_KEY = "api123";

// Load profile on page load
async function loadProfile() {
  
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const isNewUser = localStorage.getItem("isNewUser") === "true";

  const inputs = document.querySelectorAll("#accountForm input, #accountForm textarea");

  // NEW USER → enable editable fields
  if (!isNewUser) {
    inputs.forEach(input => input.disabled = true);
  }

  // EXISTING USER → fetch from backend
  if (user && user.id) {
    try {
      const res = await fetch(`${API_URL}/${user.id}`, {
         "Authorization": `Bearer ${API_KEY}`
      });
      const freshUser = await res.json();

      // Fill form fields
      document.getElementById("firstname").value = freshUser.firstName || "";
      document.getElementById("lastname").value = freshUser.lastName || "";
      document.getElementById("email").value = freshUser.email || "";
      document.getElementById("password").value = freshUser.password || "";
      document.getElementById("phone").value = freshUser.phone || "";
      document.getElementById("location").value = freshUser.location || "";
      document.getElementById("age").value = freshUser.age || "";
      document.getElementById("description").value = freshUser.description|| "";
      
      document.getElementById('api-image').src=freshUser.profilePicture;
        
      
 
      // Hide password field for existing users
      const passwordField = document.getElementById("password");
      if (passwordField) passwordField.parentElement.style.display = "none";

    } catch (err) {
      alert("Kunne ikke laste profil: " + err);
    }
  }
}

// Enable edit mode
document.getElementById("editbtn").addEventListener("click", () => {
  document.querySelectorAll("#accountForm input, #accountForm textarea")
    .forEach(input => input.disabled = false);
});

// Save profile
document.getElementById("savebtn").addEventListener("click", async () => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  alert("prof"+localStorage.getItem("isNewUser"));
  const isNewUser = localStorage.getItem("isNewUser") === "true";

  const updateUser = {
    firstName: document.getElementById("firstname").value,
    lastName: document.getElementById("lastname").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    location: document.getElementById("location").value,
    age: document.getElementById("age").value,
    description: document.getElementById("description").value,
    password: document.getElementById("password")?.value || undefined
  };

  try {
    let res;
    if (isNewUser) {
      // New user → POST
      res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify(updateUser)
      });
    } else {
      // Existing user → PUT
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
    localStorage.removeItem("isNewUser");
    alert("test" +localStorage.getItem("currentUser"))
    // Disable form fields again
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
      localStorage.removeItem("isNewUser");
      localStorage.removeItem("isLoggedIn");

      alert("Konto slettet!");
      window.location.href = "logginn.html";
    } catch (err) {
      alert("Kunne ikke slette konto: " + err);
    }
  }
});