// Products table (mirrors orders table configuration)
import {
  Tabulator,
  FormatModule,
  SortModule,
  FilterModule,
  EditModule,
  ValidateModule,
  PageModule,
} from "tabulator-tables";

Tabulator.registerModule(FormatModule);
Tabulator.registerModule(SortModule);
Tabulator.registerModule(FilterModule);
Tabulator.registerModule(EditModule);
Tabulator.registerModule(ValidateModule);
Tabulator.registerModule(PageModule);

// Example demo data provided
const demo = [
  {
    id: 1,
    sku: "BED-SET-001",
    name: "Luxury Bedding Set",
    category: "Bedding",
    price: 129.99,
    stock: 44,
    variants: [
      { color: "White", size: "Queen", price: 129.99 },
      { color: "Ivory", size: "King", price: 149.99 },
    ],
    images: [],
  },
  {
    id: 2,
    sku: "SHEET-SET-002",
    name: "Premium Sheet Set",
    category: "Bedding",
    price: 79.99,
    stock: 120,
    variants: [
      { color: "Gray", size: "Twin", price: 69.99 },
      { color: "Gray", size: "Queen", price: 79.99 },
    ],
    images: [],
  },
];

// You can replace this with real API data later
const data = demo;

const mainOptions = {
  height: "100%",
  data,
  layout: "fitColumns",
  headerSortElement: "<i class='ti ti-arrows-sort'></i>",
  placeholder: "No data found",
  pagination: true,
  paginationSize: 10,
  paginationCounter: "rows",
  columnDefaults: { minWidth: 120 },
  columns: [
    {
      title: "ID",
      field: "id",
      width: 80,
      hozAlign: "right",
      sorter: "number",
    },
    {
      title: "SKU",
      field: "sku",
      headerFilter: true,
      headerFilterPlaceholder: "Search",
      headerFilterParams: { clearable: true },
      headerFilterLiveFilter: true,
    },
    {
      title: "Name",
      field: "name",
      headerFilter: true,
      headerFilterPlaceholder: "Search",
      headerFilterParams: { clearable: true },
      headerFilterLiveFilter: true,
    },
    {
      title: "Category",
      field: "category",
      headerFilter: "list",
      headerFilterParams: {
        values: { "": "All", Bedding: "Bedding" },
        clearable: true,
      },
    },
    {
      title: "Price",
      field: "price",
      sorter: "number",
      formatter: (cell) => `$${Number(cell.getValue()).toFixed(2)}`,
      hozAlign: "right",
      headerFilter: true,
      headerFilterPlaceholder: "Search",
      headerFilterParams: { clearable: true },
      headerFilterLiveFilter: true,
    },
    {
      title: "Stock",
      field: "stock",
      sorter: "number",
      hozAlign: "right",
      headerFilter: true,
      headerFilterPlaceholder: "Search",
      headerFilterParams: { clearable: true },
      headerFilterLiveFilter: true,
      formatter: (cell) => {
        const value = Number(cell.getValue());
        const level = value <= 10 ? "low" : value <= 50 ? "med" : "high";
        return `<span class="stock-badge ${level}">${value}</span>`;
      },
    },
    {
      title: "Edit",
      field: "edit",
      hozAlign: "center",
      formatter: (cell) => {
        return `<a href="/src/pages/dashboard/products/edit-product.html?id=${cell.getRow().getData().id}" class="ds-link">Edit</a>`;
      },
    
    },
    {
      title: "Delete",
      field: "delete",
      hozAlign: "center",
      formatter: (cell) => {
        return `<button class="ds-danger-btn delete-product-btn" data-row-id="${cell.getRow().getData().id}">Delete</button>`;
      },
      cellClick: (e, cell) => {
        const row = cell.getRow();
        if (typeof window.deleteProduct === "function") {
          window.deleteProduct(row);
        }
      },
    },
  ],
  initialSort: [
    { column: "name", dir: "asc" },
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("productsTable");
  if (!container) return; // Only initialize on pages that have the table

  let table = new Tabulator(container, mainOptions);

  // Fallback: delegate click for delete buttons (in case Tabulator cellClick doesn't fire)
  container.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.classList && target.classList.contains("delete-product-btn")) {
      const rowComponent = table.getRow(target.getAttribute("data-row-id"));
      if (rowComponent) {
        if (typeof window.deleteProduct === "function") {
          window.deleteProduct(rowComponent);
        }
      }
    }
  });

  function reintializeTable() {
    if (!table) return;
    mainOptions.layout = window.innerWidth >= 768 ? "fitColumns" : "fitDataFill";
    table.destroy();
    table = new Tabulator(container, mainOptions);
  }

  window.addEventListener("resize", reintializeTable, { passive: true });
});


