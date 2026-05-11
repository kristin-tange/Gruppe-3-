//siva


document.addEventListener("DOMContentLoaded", () => {

  const logBtn = document.getElementById("loginBtn");
  const registrerBtn = document.getElementById("registrer");

  const API_URL: string = "http://localhost:3000/api/users";
  const API_KEY: string = "group3api";

  //user interface
    interface User {
    id?: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    description: string;
    }

  // -----------------------
  // Login existing user
  // -----------------------
   
   if (logBtn){
      logBtn.addEventListener("click",  async(event: Event): Promise<void> => {
    event.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value.trim();
    const password = (document.getElementById("password") as HTMLInputElement).value.trim();
     

    try {
      // Fetch users from backend (json-server)
      const res: Response = await fetch(API_URL, {
        headers: {
            "Authorization": `Bearer ${API_KEY}`
        }
      });
      const users: User[] = await res.json();

      // Find user with matching email & password
      const user = users.find((u: User) => u.email === email && u.password === password);

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
        if (err instanceof Error) {
      alert("Kunne ikke logge inn: " + err.message);
    } else {
        alert("An unknown error occurred during login.");
    }
}

  });
   }
  // -----------------------
  // New user registration
  // -----------------------
  if (registrerBtn) {
  registrerBtn.addEventListener("click", (event: Event): void => {
    event.preventDefault();
    
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