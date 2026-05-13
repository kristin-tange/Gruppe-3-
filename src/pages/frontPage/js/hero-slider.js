// Adrian Persen

const BASE_URL = "http://localhost:3000/api";

let slides = document.querySelectorAll(".hero-slide");
const prevButton = document.querySelector(".hero-prev");
const nextButton = document.querySelector(".hero-next");
const heroSection = document.querySelector(".hero");
//Holder styr på hvilken slide som er aktiv
let currentSlide = 0;

//Funksjon som viser riktig slide
function showSlide(index) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[index].classList.add("active");
}

nextButton.addEventListener("click", () => {
    currentSlide++;
//Hvis den går forbi siste slide, start på nytt fra første
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }
    showSlide(currentSlide);
});

prevButton.addEventListener("click", () => {
    currentSlide--;
//Hvis den går før første slide, hopp til siste
    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    showSlide(currentSlide);
});

//Array som lagrer meetupene fra API-et

let meetups = [];

async function fetchMeetups() {
  const response = await fetch(`${BASE_URL}/meetups`);

  if (!response.ok) { 
    throw new Error("Kunne ikke hente data");
  }

  meetups = await response.json();
}
//Lager ny hero-slide
function createHeroSlide(meetup) {
  const slide = document.createElement("div");

  slide.classList.add("hero-slide");
  slide.style.backgroundImage = `url(${meetup.image})`;

  slide.innerHTML = `
  
  <div class="hero-content event-hero-content hero-overlay">
  <h1>${meetup.name}</h1>
  <p>${meetup.summary}</p>
  <a class="arrangement-link" href="/src/pages/singleEvent/singleEvent.html?id=${meetup.id}">
  Utforsk
  </a>
  </div>

  `;
//Legger inn siden før pil-knappene i HTML
  heroSection.insertBefore(slide, prevButton);
}

//starter slider systemet
async function init() {
  await fetchMeetups();
//Filtrerer ut meetupene som skal brukes i hero-slideren
  const heroMeetups = meetups.filter((meetup) => {
    return meetup.id == 1 || meetup.id == 3;
  });
//Lager hero slide for hvert meetup
  heroMeetups.forEach((meetup) => {
    createHeroSlide(meetup);
  });
//Henter alle hero slides på nytt, siden nye slides er lagt til
  slides = document.querySelectorAll(".hero-slide");

//Switcher slide automatisk hvert 7. sekund
setInterval(() => {

  currentSlide++;

  if (currentSlide >= slides.length) {
    currentSlide = 0;
  }

  showSlide(currentSlide);

}, 7000);

}

init();

lucide.createIcons();

