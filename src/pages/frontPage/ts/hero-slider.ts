// Adrian Persen

const BASE_URL = "http://localhost:3000/api";
//Forteller TS at lucide finnes i browseren
declare const lucide: any;

let slides = document.querySelectorAll(".hero-slide");
const prevButton = document.querySelector(".hero-prev");
const nextButton = document.querySelector(".hero-next");
const heroSection = document.querySelector(".hero");
//Holder styr på hvilken slide som er aktiv
let currentSlide = 0;

//Funksjon som viser riktig slide
//:number betyr at index må være et tall
//:void betyr at funksjonen ikke returnerer noe
function showSlide(index: number): void {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[index].classList.add("active");
}
//Sjekker at nextButton finnes før den brukes / Hindrer feil hvis querySelector returnerer null
if (nextButton) {
nextButton.addEventListener("click", () => {
    currentSlide++;
//Hvis den går forbi siste slide, start på nytt fra første
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }
    showSlide(currentSlide);
});
}
//Sjekker at prevButton finnes før den brukes
if (prevButton) {
prevButton.addEventListener("click", () => {
    currentSlide--;
//Hvis den går før første slide, hopp til siste
    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    showSlide(currentSlide);
});
}

//Array som lagrer meetupene fra API-et

//Forteller TS hvordan meetup-objektene fra API-et ser ut
interface Meetup {
    id: number;
    name: string;
    summary: string;
    image: string;
}
//Forteller TS at meetups er et array med Meetup-objekter
let meetups: Meetup[] = [];

async function fetchMeetups() {
  const response = await fetch(`${BASE_URL}/meetups`);

  if (!response.ok) { 
    throw new Error("Kunne ikke hente data");
  }

  meetups = await response.json();
}
//Lager ny hero-slide
//meetup: Meetup betyr at parameteren må følge Meetup-interfacet
function createHeroSlide(meetup: Meetup): void {
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
//Sjekker at heroSection og prevButton finnes før insertBefore kjøres
if (heroSection && prevButton) {
  heroSection.insertBefore(slide, prevButton);
}
}
//starter slider systemet
async function init() {
  await fetchMeetups();
//Filtrerer ut meetupene som skal brukes i hero-slideren
  const heroMeetups = meetups.filter((meetup) => {
    return meetup.id === 1 || meetup.id === 3;
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

