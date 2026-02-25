const hamburger = document.querySelector(".hamburger");
const sideNav = document.querySelector(".sideNav");
const backdrop = document.querySelector(".hamburger-backdrop");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  sideNav.classList.toggle("active");
  backdrop.classList.toggle("active");
});

backdrop.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  sideNav.classList.toggle("active");
  backdrop.classList.toggle("active");
});
