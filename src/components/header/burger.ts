// Oscar Wirum

export function initBurgerMenu() {
  const hamburger = document.querySelector(".hamburger") as HTMLElement;
  const sideNav = document.querySelector(".sideNav") as HTMLElement;
  const backdrop = document.querySelector(".hamburger-backdrop") as HTMLElement;

  if (!hamburger || !sideNav || !backdrop) return;

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
}
