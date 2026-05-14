// Adrian Persen

import {fetchMeetups} from "../../../ts/api";
import type {Meetup} from "../../../ts/types";

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
  const meetups = await fetchMeetups();
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

