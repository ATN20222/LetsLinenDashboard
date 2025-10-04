// Shared sidebar toggle for all pages (optional include)
document.addEventListener('DOMContentLoaded', function () {
  var app = document.querySelector('.ds-app');
  var toggle = document.getElementById('sidebarToggle');
  if (!app || !toggle) return;
  toggle.addEventListener('click', function (e) {
    e.preventDefault();
    app.classList.toggle('sidebar-open');
    toggle.setAttribute('aria-expanded', app.classList.contains('sidebar-open') ? 'true' : 'false');
  });
});


