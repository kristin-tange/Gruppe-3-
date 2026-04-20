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

// startet på å hente meetups fra api slide-2

const BASE_URL = "http://localhost:3000/api";

let meetups = [];

async function fetchMeetups() {
  const response = await fetch(`${BASE_URL}/meetups`);

  if (!response.ok) { 
    throw new Error("Kunne ikke hente data");
  }

  meetups = await response.json();

}

function renderHero(meetup) {
  const slide2 = document.querySelector(".slide-2");
  const title = document.getElementById("slide2-title");
  const desc = document.getElementById("slide2-desc");

  if (!slide2 || !title || !desc || !meetup) return;

  title.textContent = meetup.name;
  desc.textContent = meetup.description;
  /* henter bildet manuelt midlertidig */
  slide2.style.backgroundImage = `url(./public/assets/img/categories/technology1.jpg)`;
}

async function init() {
  await fetchMeetups();

  const meetup = meetups.find((m) => m.id == 1);

  renderHero(meetup);
}

init();
