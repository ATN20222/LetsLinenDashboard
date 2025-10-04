export default function initTableFilters() {
  const filtersBtn = document.getElementById("filters-btn");
  if (filtersBtn) {
    filtersBtn.addEventListener("click", () => {
      filtersBtn.classList.toggle("active");
      let table = filtersBtn.closest(".header").nextElementSibling;
      const headerFilters = table.querySelectorAll(".tabulator-header-filter");
      headerFilters &&
        headerFilters.forEach((filter) => {
          filter.classList.toggle("!block");
        });
    });
  }
}
