// siva

document.addEventListener("DOMContentLoaded", loadProfile);

const API_URL = "http://localhost:3000/api/users";
const API_KEY = "group3api";

// Load profile on page load
async function loadProfile() {

  // Get user from localStorage 
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const isNewUser = !user.id;

  // Get all inputs
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

      //Convert to json
      const existingUser = await res.json();

      // Fill form fields (NO PASSWORD)
      document.getElementById("usernameTitle").textContent =
        `Velkommen ${existingUser.firstName}!`;

      document.getElementById("firstname").value = existingUser.firstName || "";
      document.getElementById("lastname").value = existingUser.lastName || "";
      document.getElementById("username").value = existingUser.username || "";
      document.getElementById("email").value = existingUser.email || "";
      document.getElementById("description").value = existingUser.description || "";
      
      // Set Gender
      document.querySelectorAll('input[name="gender"]').forEach(radio => {
        radio.checked = radio.value === existingUser.gender;
      });

     // change profile image based on gender
      const gender = existingUser.gender;

      if (gender === "mann") {
        profileImage.src = "/assets/img/profilepictureman.png";
      } else if (gender === "kvinne") {
        profileImage.src = "/assets/img/profilepicturewoman.jpeg";
      }

    } catch (err) {
      alert("Kunne ikke laste profil: " + err);
    }
  }

  // Gender image change 
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
//enable all inputs
  document.querySelectorAll("#accountForm input, #accountForm textarea")
    .forEach(input => input.disabled = false);

});

// Save profile
document.getElementById("accountForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get user from localStorage to check if it's a new user or existing

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const isNewUser = !user.id;

  const passwordInput = document.getElementById("password");
  const password = passwordInput ? passwordInput.value.trim() : "";

  // Validate password ONLY for new users
  if (isNewUser && password.length < 8) {
    alert("Passord må være minst 8 tegn");
    return;
  }

  // Get profile image 
  const profileImage = document.getElementById("profileImage");

  if (!profileImage.src) {
    console.error("Ingen profilbilde valgt");
    return;
  }    
  const url = new URL(profileImage.src);
  const relativePath = url.pathname;
 // create user object to send to backend

  const updateUser = {
    firstName: document.getElementById("firstname").value,
    lastName: document.getElementById("lastname").value,
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    description: document.getElementById("description").value,
    gender: document.querySelector('input[name="gender"]:checked')?.value,
    image: relativePath
  };

  //Add password only if it's a new user, otherwise keep existing password
   
  if (isNewUser) {
    updateUser.password = password;
  }else
  {updateUser.password = user.password;
  }
  try {
    let res;
    // create user

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
  // Convert response to json
    const savedUser = await res.json();

    //new user

    if (isNewUser) {
      alert("Konto opprettet! Vennligst logg inn.");
      window.location.href = "login.html";
       
    } else {
      // save updated user to localStorage
    
         localStorage.setItem("currentUser", JSON.stringify(savedUser));
         

    // Disable again
    document.querySelectorAll("#accountForm input, #accountForm textarea")
      .forEach(input => input.disabled = true);
    }

  } catch (err) {
    alert("Kunne ikke lagre profil: " + err);
  }
});
// Delete account
document.getElementById("deletebtn")?.addEventListener("click", async () => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

// stop if no user or new user
  if (!user.id) return;

  if (confirm("Er du sikker på at du vil slette kontoen?")) {
    try {
      await fetch(`${API_URL}/${user.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${API_KEY}` }
      });

      //remove local storage

      localStorage.removeItem("currentUser");

      alert("Konto slettet!");

      // Redirect to login page
      window.location.href = "login.html";

    } catch (err) {
      alert("Kunne ikke slette konto: " + err);
    }
  }
});