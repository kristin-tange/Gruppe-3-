//siva
import { BASE_URL, API_KEY } from "../../../ts/config";
import type { User,LoginUser} from "../../../ts/types";


document.addEventListener("DOMContentLoaded", (): void => {

  const logBtn = document.getElementById("loginBtn") as HTMLButtonElement | null;
  const registrerBtn = document.getElementById("registrer") as HTMLButtonElement | null;

   const API_URL = `${BASE_URL}/users`;

 
  // -----------------------
  // Login existing user
  // -----------------------
   
   if (logBtn){
      logBtn.addEventListener("click", async (event: Event): Promise<void> => {

      event.preventDefault();

    const emailInput = document.getElementById("email")  as HTMLInputElement | null;
    const passwordInput = document.getElementById("password") as HTMLInputElement | null;

     if (!emailInput || !passwordInput) return;

     const email: string = emailInput.value.trim();
     const password: string = passwordInput.value.trim();

    try {
      // Fetch users from backend (json-server)
      const res: Response = await fetch(API_URL, {
        headers: {
          "Authorization":  `Bearer ${API_KEY}`
        }
      
      });

      if (!res.ok) {
        throw new Error("kunne ikke hente brukere");
      }
      const users: User[] = await res.json();

      // Find user with matching email & password
      const user: User | undefined = users.find(u => u.email === email && u.password === password);

      if (!user) {
        alert("Feil e-post eller passord");
        return;
      }

      //safe storage
       const safeUser: LoginUser= {
          id: user.id,
          email: user.email
          
      };


      // Save user to localStorage
      localStorage.setItem("currentUser", JSON.stringify(safeUser));
      localStorage.setItem("isLoggedIn", "true");
      
  
      // Navigate to index page
      window.location.href = "../../../index.html";
 } catch (err: unknown) {

        if (err instanceof Error) {
          alert("Kunne ikke logge inn: " + err.message);
        } else {
          alert("Ukjent feil ved innlogging");
        }
      }
    });
  } 
  
  // New user registration

  if (registrerBtn) {
  registrerBtn.addEventListener("click", (event: Event): void => {
    event.preventDefault();
  
    localStorage.setItem("isNewUser", "true");
    
    // Navigate to profile page
    window.location.href = "profile.html";
  });

  }
   
});
  

