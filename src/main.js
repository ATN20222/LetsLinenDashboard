// -- Style
import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  // Loader
  const body = document.body;
  window.onload = () => body.classList.remove("spinner");
});
