// Order Items table: Tabulator with item, sku, quantity, total price
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

// Demo items data (could be replaced by real order items)
const items = [
  { item: "Luxury Bedding Set", sku: "BED-SET-001", quantity: 1, total: 129.99 },
  { item: "Premium Sheet Set", sku: "SHEET-SET-002", quantity: 2, total: 159.98 },
];

const options = {
  height: "100%",
  data: items,
  layout: "fitColumns",
  headerSortElement: "<i class='ti ti-arrows-sort'></i>",
  placeholder: "No items",
  columnDefaults: { minWidth: 120 },
  columns: [
    { title: "Item", field: "item", headerFilter: true, headerFilterPlaceholder: "Search", headerFilterParams: { clearable: true }, headerFilterLiveFilter: true },
    { title: "SKU", field: "sku", headerFilter: true, headerFilterPlaceholder: "Search", headerFilterParams: { clearable: true }, headerFilterLiveFilter: true },
    { title: "Quantity", field: "quantity", sorter: "number", hozAlign: "right" },
    { title: "Total Price", field: "total", sorter: "number", hozAlign: "right", formatter: (cell) => `$${Number(cell.getValue()).toFixed(2)}` },
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("itemsList");
  if (!container) return;

  // Replace simple list with table
  const tableDiv = document.createElement("div");
  container.innerHTML = "";
  container.appendChild(tableDiv);

  let table = new Tabulator(tableDiv, options);

  function reintializeTable() {
    if (!table) return;
    options.layout = window.innerWidth >= 768 ? "fitColumns" : "fitDataFill";
    table.destroy();
    table = new Tabulator(tableDiv, options);
  }

  window.addEventListener("resize", reintializeTable, { passive: true });
});


