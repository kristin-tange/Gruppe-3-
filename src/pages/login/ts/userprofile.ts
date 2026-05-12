// siva

document.addEventListener("DOMContentLoaded", loadProfile);

const API_URL: string = "http://localhost:3000/api/users";
const API_KEY: string = "group3api";

//user interface
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


// Load profile on page load
async function loadProfile(): Promise<void> {

  // Get user from localStorage 
  const user: User = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const isNewUser: boolean = !user.id;

  // Get all inputs
  const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("#accountForm input, #accountForm textarea");
  const passwordContainer = document.getElementById("passwordGroup") as HTMLElement;
  const profileImage = document.getElementById("profileImage") as HTMLImageElement;
 

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
      const existingUser: User = await res.json();

      // Fill form fields (NO PASSWORD)
      (document.getElementById("usernameTitle") as HTMLElement).textContent =
        `Velkommen ${existingUser.firstName}!`;

      (document.getElementById("firstname") as HTMLInputElement).value = existingUser.firstName || "";
      (document.getElementById("lastname") as HTMLInputElement).value = existingUser.lastName || "";
      (document.getElementById("username") as HTMLInputElement).value = existingUser.username || "";
      (document.getElementById("email") as HTMLInputElement).value = existingUser.email || "";
      (document.getElementById("description") as HTMLTextAreaElement).value = existingUser.description || "";

      // Set Gender
      document.querySelectorAll<HTMLInputElement>('input[name="gender"]').forEach(radio => {
        radio.checked = radio.value === existingUser.gender;
      });

      //change profile image based on existing user data
    

     // change profile image based on gender
      const gender: string | undefined = existingUser.gender;

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
  document.querySelectorAll<HTMLInputElement>('input[name="gender"]').forEach(radio => {

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
document.getElementById("editbtn")?.addEventListener("click", () => {
//enable all inputs
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("#accountForm input, #accountForm textarea")
    .forEach(input => input.disabled = false);

});

// Save profile
document.getElementById("accountForm")?.addEventListener("submit", async (e: Event) => {
  e.preventDefault();

  // Get user from localStorage to check if it's a new user or existing

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const isNewUser: boolean = !user.id;

  const passwordInput = document.getElementById("password") as HTMLInputElement | null;
  const password = passwordInput?.value.trim() || "";

  // Validate password ONLY for new users
  if (isNewUser && password.length < 8) {
    alert("Passord må være minst 8 tegn");
    return;
  }

  // Get profile image 
  const profileImage = document.getElementById("profileImage") as HTMLImageElement;

  if (!profileImage.src) {
    console.error("Ingen profilbilde valgt");
    return;
  }    
  const url = new URL(profileImage.src);
  const relativePath = url.pathname;
 // create user object to send to backend

  const updateUser = {
    firstName: (document.getElementById("firstname") as HTMLInputElement).value,
    lastName: (document.getElementById("lastname") as HTMLInputElement).value,
    username: (document.getElementById("username") as HTMLInputElement).value,
    email: (document.getElementById("email") as HTMLInputElement).value,
    description: (document.getElementById("description") as HTMLTextAreaElement).value,
    gender: (document.querySelector('input[name="gender"]:checked') as HTMLInputElement)?.value,
    image: relativePath,
    password: isNewUser ? password : user.password
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
    document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("#accountForm input, #accountForm textarea")
      .forEach(input => input.disabled = true);
    }

  } catch (err) {
    alert("Kunne ikke lagre profil: " + err);
  }
});
// Delete account
document.getElementById("deletebtn")?.addEventListener("click", async (): Promise<void> => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

// stop if no user or new user
  if (!user.id) return;

  const confirmed: boolean = confirm("Er du sikker på at du vil slette kontoen?");
   
   if (!confirmed) return;

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
});