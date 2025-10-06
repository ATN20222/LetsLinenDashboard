// Dashboard Home: Sidebar toggle + Chart.js initialization (ESM)
import Chart from "chart.js/auto";

document.addEventListener("DOMContentLoaded", () => {

  const css = getComputedStyle(document.documentElement);
  const getVar = (name, fallback) => {
    const v = (css.getPropertyValue(name) || "").trim();
    return v && v !== "inherit" ? v : fallback;
  };

  const textColor = getVar("--color-light", "#ffffff");
  const textColorSecondary = getVar("--color-text-secondary", "#b0b0b0");
  const borderColor = getVar("--color-border-primary", "rgba(255,255,255,0.08)");
  const secondaryColor = getVar("--color-secondary", "#9DD8D4");
  const gridColor = getVar("--color-muted", "rgba(255,255,255,0.06)");

  const revenueCanvas = document.getElementById("revenueChart");
  const categoryCanvas = document.getElementById("categoryChart");

  if (revenueCanvas) {
    const ctx = revenueCanvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(157,216,212,0.45)");
    gradient.addColorStop(1, "rgba(157,216,212,0.06)");

    new Chart(revenueCanvas, {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Revenue",
            data: [12, 19, 15, 22, 30, 28, 35, 42, 38, 45, 50, 58],
            borderColor: secondaryColor,
            backgroundColor: gradient,
            fill: true,
            tension: 0.35,
            pointRadius: 2.5,
            pointBackgroundColor: secondaryColor,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: "index", intersect: false },
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor },
          },
          y: {
            grid: { color: gridColor },
            ticks: { color: textColorSecondary },
          },
        },
      },
    });
  }

  if (categoryCanvas) {
    new Chart(categoryCanvas, {
      type: "doughnut",
      data: {
        labels: ["Bedding", "Decor", "Bath", "Bundles"],
        datasets: [
          {
            data: [45, 25, 15, 15],
            backgroundColor: [
              secondaryColor,
              "rgba(157,216,212,0.6)",
              "rgba(157,216,212,0.3)",
              "rgba(157,216,212,0.15)",
            ],
            borderColor: borderColor,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: textColor },
          },
        },
        cutout: "60%",
      },
    });
  }
});


