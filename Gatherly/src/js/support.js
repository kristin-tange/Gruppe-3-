// Adrian Persen

const supportBtn = document.getElementById("support-btn");
const supportBox = document.getElementById("support-box");
const closeBtn = document.getElementById("close-support-btn");

supportBtn.addEventListener("click", () => {
    supportBox.classList.add("active");
});

closeBtn.addEventListener("click", () => {
    supportBox.classList.remove("active");
});

window.addEventListener("click", (e) => {
    if (e.target === supportBox) {
        supportBox.classList.remove("active");
    }
});

const supportForm = document.getElementById("support-form");

supportForm.addEventListener("submit", (e) => {
    e.preventDefault();

    alert("Support-saken din er sendt inn!");

    supportForm.reset();
    supportBox.classList.remove("active");
})