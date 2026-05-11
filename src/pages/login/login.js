//siva

document.addEventListener("DOMContentLoaded", () => {

  const logBtn = document.getElementById("loginBtn");
  const registrerBtn = document.getElementById("registrer");

  const API_URL = "http://localhost:3000/api/users";
  const API_KEY = "group3api";

  // -----------------------
  // Login existing user
  // -----------------------
   
   if (logBtn){
      logBtn.addEventListener("click",  async(event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();


    try {
      // Fetch users from backend (json-server)
      const res = await fetch("http://localhost:3000/api/users");
      const users = await res.json();

      // Find user with matching email & password
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        alert("Feil e-post eller passord");
        return;
      }

      // Save user to localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
      
  
      // Navigate to index page
      window.location.href = "../../../index.html";

    } catch (err) {
      alert("Kunne ikke logge inn: " + err.message);
    }
  });
   }
  // -----------------------
  // New user registration
  // -----------------------
  if (registrerBtn) {
  registrerBtn.addEventListener("click", (event) => {
    event.preventDefault();
    alert("reg");
    // Create empty new user
    const newUser = {
      firstname:"",
      lastname: "",
      email: "",
      password: "",
      description: "", 
    };

    localStorage.setItem("currentUser", JSON.stringify(newUser));
    localStorage.setItem("isLoggedIn", "false");
    
    // Navigate to profile page
    window.location.href = "profile.html";
  });

  }


  });