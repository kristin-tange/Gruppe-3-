// siva

document.addEventListener("DOMContentLoaded", loadProfile);

const API_URL = "http://localhost:3000/api/users";
const API_KEY = "group3api";

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
        headers: {
        "Authorization": `Bearer ${API_KEY}`
        }
      });
      const freshUser = await res.json();

      // Fill form fields
      document.getElementById("usernameTitle").textContent = `Velkommen ${freshUser.firstName}! `;
      document.getElementById("firstname").value = freshUser.firstName || "";
      document.getElementById("lastname").value = freshUser.lastName || "";
      document.getElementById("email").value = freshUser.email || "";
      document.getElementById("password").value = freshUser.password || "";
      document.getElementById("phone").value = freshUser.phone || "";
      document.getElementById("location").value = freshUser.location || "";
      document.getElementById("age").value = freshUser.age || "";
      document.getElementById("description").value = freshUser.description|| "";
      
      
      const profileImage = document.getElementById("profileImage");
      const gender = freshUser.gender?.toLowerCase(). trim();
       
       if (gender === "mann") {
        profileImage.src = "/assets/img/profilepictureman.png";
      } else if (gender === "kvinne") {
        profileImage.src = "/assets/img/profilepicturewoman.jpeg";
       } 

      const isNewUser = localStorage.getItem("isNewUser") === "true";

      document.querySelectorAll('input[name="gender"]').forEach(radio => {
        radio.checked = radio.value === freshUser.gender;

        // disable gender if not new user
        if (!isNewUser) {
          radio.disabled = true;
        }

        radio.addEventListener("change", () => {
          console.log("selected gender: " + radio.value);

          if (radio.value === "mann") {
            profileImage.src = "/assets/img/profilepictureman.png";
            console.log("changed to male image")
          } else if (radio.value === "kvinne") {
            profileImage.src = "/assets/img/profilepicturewoman.jpeg";
              console.log("changed to female image")
          }
          
        });
      });
 // set image immediately
      if (freshUser.gender === "mann") {
        profileImage.src = "/assets/img/profilepictureman.png";
        profileImage.onload = () => console.log("Image loaded OK");
        profileImage.onerror = () => console.log("Image FAILED");
      } else if (freshUser.gender === "kvinne") {
        profileImage.src = "/assets/img/profilepicturewoman.jpeg";
        profileImage.onload = () => console.log("Image loaded OK");
        profileImage.onerror = () => console.log("Image FAILED");
      }

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

    //keep gender disabled for existing users
    const isNewUser = localStorage.getItem("isNewUser") === "true";
    if (!isNewUser) {
      document.querySelectorAll('input[name="gender"]').forEach(radio => {
        radio.disabled = true;
      });
    }
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
    gender: document.querySelector('input[name="gender"]:checked')?.value,
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
      window.location.href = "login.html";
    } catch (err) {
      alert("Kunne ikke slette konto: " + err);
    }
  }
});