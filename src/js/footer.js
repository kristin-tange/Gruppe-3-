// Jan-Roger Kviteberg

function displayFooter() {
  const footer = document.querySelector("footer");

  if (!footer) {
    console.error("Footer element not found.");
    return;
  }

  footer.innerHTML = `
    <p class="center">© Gatherly 2026</p>

    <nav class="footer-right" aria-label="Social media links">
      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" class="social-link">
        <img src="/assets/icons/facebook.png" alt="Facebook" class="icon" />
      </a>
      <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" class="social-link">
        <img src="/assets/icons/instagram.png" alt="Instagram" class="icon" />
      </a>
      <a href="mailto:post@gatherly.no" class="social-link">
        <img src="/assets/icons/mail.png" alt="Email" class="icon" />
      </a>
    </nav>
  `;
}

displayFooter();