// Dashboard Home: Sidebar toggle + Chart.js initialization
document.addEventListener('DOMContentLoaded', function () {
  var app = document.querySelector('.ds-app');
  var toggle = document.getElementById('sidebarToggle');

  if (toggle && app) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      app.classList.toggle('sidebar-open');
      var expanded = app.classList.contains('sidebar-open');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });

    // Close sidebar when clicking outside on small screens
    document.addEventListener('click', function (e) {
      if (!app.classList.contains('sidebar-open')) return;
      var sidebar = document.querySelector('.ds-sidebar');
      if (sidebar && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
        app.classList.remove('sidebar-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (typeof Chart === 'undefined') return;

  var docStyle = getComputedStyle(document.documentElement);
  var textColor = (docStyle.getPropertyValue('--text-color') || '#ffffff').trim();
  var textColorSecondary = (docStyle.getPropertyValue('--text-color-secondary') || '#b0b0b0').trim();
  var borderColor = (docStyle.getPropertyValue('--border-color') || 'rgba(255,255,255,0.08)').trim();
  var secondaryColor = (docStyle.getPropertyValue('--secondary-color') || '#9DD8D4').trim();

  var revenueCanvas = document.getElementById('revenueChart');
  var categoryCanvas = document.getElementById('categoryChart');

  if (revenueCanvas) {
    var ctx = revenueCanvas.getContext('2d');
    var gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(157,216,212,0.45)');
    gradient.addColorStop(1, 'rgba(157,216,212,0.06)');

    new Chart(revenueCanvas, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Revenue',
          data: [12, 19, 15, 22, 30, 28, 35, 42, 38, 45, 50, 58],
          borderColor: secondaryColor,
          backgroundColor: gradient,
          fill: true,
          tension: 0.35,
          pointRadius: 2.5,
          pointBackgroundColor: secondaryColor,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: textColor }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: textColorSecondary }
          }
        }
      }
    });
  }

  if (categoryCanvas) {
    new Chart(categoryCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Bedding', 'Decor', 'Bath', 'Bundles'],
        datasets: [{
          data: [45, 25, 15, 15],
          backgroundColor: [
            secondaryColor,
            'rgba(157,216,212,0.6)',
            'rgba(157,216,212,0.3)',
            'rgba(157,216,212,0.15)'
          ],
          borderColor: borderColor
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: textColor }
          }
        },
        cutout: '60%'
      }
    });
  }
});

