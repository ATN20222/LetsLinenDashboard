// Sidebar toggle: controls mobile open/close via .ds-app.sidebar-open
document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector(".ds-app");
  const toggle = document.getElementById("sidebarToggle");
  if (!app || !toggle) return;

  const setExpanded = (expanded) => {
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  };

  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    app.classList.toggle("sidebar-open");
    setExpanded(app.classList.contains("sidebar-open"));
  });

  // Close when clicking outside on small screens
  document.addEventListener("click", (e) => {
    if (!app.classList.contains("sidebar-open")) return;
    const sidebar = document.querySelector(".ds-sidebar");
    if (sidebar && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
      app.classList.remove("sidebar-open");
      setExpanded(false);
    }
  });
});


