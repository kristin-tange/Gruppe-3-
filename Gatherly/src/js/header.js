// Oscar Wirum

const header = document.querySelector("header");

function isLoggedIn() {
  //må gjøres om senere med API key
  return localStorage.getItem("loggedIn") === "true";
}

function updateLoginArea() {
  const loginArea = document.querySelector(".login-area");

  if (!loginArea) return;

  if (isLoggedIn()) {
    loginArea.innerHTML = `
      <a href="/Gatherly/profile.html" class="profile-btn">
        <img src="/Gatherly/public/assets/icons/header-user.png" alt="Profil" />
      </a>
    `;
  } else {
    loginArea.innerHTML = `
        <div class="login-wrapper">
          <img src="/Gatherly/public/assets/icons/login.png" alt="Logg inn" class="login-btn" />
            <div class="login-popup">
              <a href="/Gatherly/login.html" class="popup-btn">Logg inn</a>
              <a href="/Gatherly/register.html" class="popup-btn create">Opprett konto</a>
          </div>
        </div>

    `;
  }
}

function displayHeader() {
  header.innerHTML = `
    <div class="hamburger-backdrop"></div>
      <div id="menu-div"><button class="hamburger" aria-label="Åpne meny">
        <div>
          <img src="/Gatherly/public/assets/icons/menu.png" alt="" />
        </div>
      </button></div>
      <div id="logoCon">
        <a href="/Gatherly/index.html"
          ><img
            src="/Gatherly/public/assets/icons/logo.png"
            alt="logo"
            id="topLogo"
        /></a>
      </div>
      <div class="login-area" aria-label="Logg inn"></div>
      <nav class="sideNav">
        <ul>
          <li><a href="/Gatherly/index.html">Hjem</a></li>
          <li><a href="" class="active">Arrangementer</a></li>
          <li><a href="">Kontakt</a></li>
        </ul>
      </nav>`;
  updateLoginArea();
}

//midlertidig switch for loggedIn - Bytt mellom true eller false for å se endring på siden.
localStorage.setItem("loggedIn", "true");

displayHeader();