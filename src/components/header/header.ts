// Oscar Wirum

import { initBurgerMenu } from "./burger.ts";


const header = document.querySelector("header") as HTMLElement;

function isLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

function updateLoginArea() {
  const loginArea = document.querySelector(".login-area");

  if (!loginArea) return;

  if (isLoggedIn()) {
    loginArea.innerHTML = `
    <div class="login-wrapper">
          <img src="/assets/icons/header-user.png" alt="Logg inn" class="login-btn" />
            <div class="login-popup">
              <a href="/src/pages/login/profile.html" class="popup-btn">Min Profil</a>
              <a href="/index.html" class="popup-btn create logout-btn">Logg Ut</a>
          </div>
        </div>
    `;
  } else {
    loginArea.innerHTML = `
        <div class="login-wrapper">
          <img src="/assets/icons/login.png" alt="Logg inn" class="login-btn" />
            <div class="login-popup">
              <a href="/src/pages/login/login.html" class="popup-btn">Logg inn</a>
              <a href="/src/pages/login/profile.html" class="popup-btn create">Opprett konto</a>
          </div>
        </div>

    `;
  }
  const logoutBtn = document.querySelector(".logout-btn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("apiKey");
  });
}

function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".sideNav a");

  navLinks.forEach((link) => {
    link.classList.remove("active");

    const href = link.getAttribute("href");
    if (!href) return;
    if (currentPath.includes(href)) {
      link.classList.add("active");
    }
  });
}

function displayHeader() {

  header.innerHTML = `
    <div class="hamburger-backdrop"></div>
      <div id="menu-div"><button class="hamburger" aria-label="Åpne meny">
        <div>
          <img src="/assets/icons/menu.png" alt="" />
        </div>
      </button></div>
      <div id="logoCon">
        <a href="/index.html"
          ><img
            src="/assets/icons/logo.png"
            alt="logo"
            id="topLogo"
        /></a>
      </div>
      <div class="login-area" aria-label="Logg inn"></div>
      <nav class="sideNav">
        <ul>
          <li><a href="/index.html" class="">Hjem</a></li>
          <li><a href="/src/pages/events/events.html" class="">Arrangementer</a></li>
          <li><a href="/src/pages/contact/contact.html" class="">Kontakt</a></li>
          <li><a href="/src/pages/createEvent/createEvent.html" class="">Lag arrangement</a></li>
        </ul>
      </nav>`;
  updateLoginArea();
}

displayHeader();
setActiveNavLink();
initBurgerMenu();