document.getElementById("registrerdeg").addEventListener("click",()=> {
  localStorage.setItem("newUser","true");
  window.location.href ="profile.html";
})

/*const loggedInUser =JSON.parse(localStorage.getItem("currentUser"));
const newUser =localStorage.getItem("newUser");

if (!loggedInUser && !newUser) {
  window.location.href = "logginn.html";

}*/

 async function loginUser(event) {
  event.preventDefault();

  // 1. Get input
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  try {
    // 2. Call API (dummy user 1)
    const response = await fetch("http://localhost:3000/users");
    const users = await response.json();

    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      alert("Incorrect email or password");
      return;
    }
    localStorage.setItem("currentUser", JSON.stringify(user));

    
    setTimeout(() => {
      window.location.href = "profile.html";
    }, 50);
  } catch (error) {
    alert("Login failed: " + error.message);
  }
}
