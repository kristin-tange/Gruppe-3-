// Oscar Wirum

const header = document.querySelector("header");

function displayHeader() {
  header.innerHTML = `
    <div class="hamburger-backdrop"></div>
      <button class="hamburger" aria-label="Åpne meny">
        <div>
          <img src="/Gatherly/public/assets/icons/menu.png" alt="" />
        </div>
      </button>
      <div id="logoCon">
        <a href="/Gatherly/index.html"
          ><img
            src="/Gatherly/public/assets/icons/logo.png"
            alt="logo"
            id="topLogo"
        /></a>
      </div>
      <button class="login" aria-label="Logg inn">
        <div>
        <a href="">
        <img src="/Gatherly/public/assets/icons/login.png" alt="" /></a></div>
      </button>
      <nav class="sideNav">
        <ul>
          <li><a href="/Gatherly/index.html">Hjem</a></li>
          <li><a href="" class="active">Arrangementer</a></li>
          <li><a href="">Kontakt</a></li>
        </ul>
      </nav>`;
}

displayHeader();
