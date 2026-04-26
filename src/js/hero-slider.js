// Adrian Persen
console.log("hero-slider.js kjører")

const slides = document.querySelectorAll(".hero-slide");
const prevButton = document.querySelector(".hero-prev");
const nextButton = document.querySelector(".hero-next");
let currentSlide = 0;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[index].classList.add("active");
}

nextButton.addEventListener("click", () => {
    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }
    showSlide(currentSlide);
});

prevButton.addEventListener("click", () => {
    currentSlide--;

    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    showSlide(currentSlide);
});

// startet på å hente meetups fra api

const BASE_URL = "http://localhost:3000/api";

let meetups = [];

async function fetchMeetups() {
  const response = await fetch(`${BASE_URL}/meetups`);

  if (!response.ok) { 
    throw new Error("Kunne ikke hente data");
  }

  meetups = await response.json();

}

function renderSlide(meetup, slideSelector, titleId, descId) {
  const slide = document.querySelector(slideSelector);
  const title = document.getElementById(titleId);
  const desc = document.getElementById(descId);

  if (!slide || !title || !desc || !meetup) return;

  title.textContent = meetup.name;
  desc.textContent = meetup.summary;
  slide.style.backgroundImage = `url(${meetup.image})`;
}

async function init() {
  await fetchMeetups();

  const meetup1 = meetups.find((m) => m.id == 1);
  const meetup2 = meetups.find((m) => m.id == 3);

  renderSlide(meetup1, ".slide-2", "slide2-title", "slide2-desc");
  renderSlide(meetup2, ".slide-3", "slide3-title", "slide3-desc");
}

init();


