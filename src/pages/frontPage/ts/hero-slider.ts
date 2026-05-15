// Adrian Persen

import { fetchMeetups } from "../../../ts/api";
import type { Meetup } from "../../../ts/types";

declare const lucide: any;

let slides = document.querySelectorAll<HTMLElement>(".hero-slide");
const prevButton = document.querySelector(
  ".hero-prev",
) as HTMLButtonElement | null;
const nextButton = document.querySelector(
  ".hero-next",
) as HTMLButtonElement | null;
const heroSection = document.querySelector(".hero") as HTMLElement | null;

let currentSlide = 0;

function showSlide(index: number): void {
  slides.forEach((slide) => slide.classList.remove("active"));
  slides[index].classList.add("active");
}

if (nextButton) {
  nextButton.addEventListener("click", () => {
    currentSlide++;

    if (currentSlide >= slides.length) {
      currentSlide = 0;
    }
    showSlide(currentSlide);
  });
}

if (prevButton) {
  prevButton.addEventListener("click", () => {
    currentSlide--;

    if (currentSlide < 0) {
      currentSlide = slides.length - 1;
    }
    showSlide(currentSlide);
  });
}

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

  if (heroSection && prevButton) {
    heroSection.insertBefore(slide, prevButton);
  }
}

async function init() {
  const meetups = await fetchMeetups();

  const heroMeetups = meetups.filter((meetup) => {
    return meetup.id === 1 || meetup.id === 3;
  });

  heroMeetups.forEach((meetup) => {
    createHeroSlide(meetup);
  });

  slides = document.querySelectorAll(".hero-slide");

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
