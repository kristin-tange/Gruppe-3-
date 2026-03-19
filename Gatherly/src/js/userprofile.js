if (window.location.pathname.includes("profile.html")) {
    setTimeout(loadProfile,50);
}


function loadProfile() {
  
    const user = JSON.parse(localStorage.getItem("currentUser"));

    // NEW USER → empty profile
    if (newUser && !user) {
        console.log("New user. Empty profile.");
        return
    }
        
    }

    // EXISTING USER → fill fields
    document.getElementById("firstname").value = user.firstName || "";
    document.getElementById("lastname").value = user.lastName || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("password").value = user.password || "";
    document.getElementById("phone").value = user.phone || "";
    document.getElementById("location").value = user.location || "";
    document.getElementById("dob").value = user.dateOfBirth || "";
    document.getElementById("bio").value = user.bio || "";


document.getElementById("editbtn").addEventListener("click", () => {
    document.querySelectorAll("#accountForm input").forEach(input => {
        input.disabled = false;
    });
});





