// Orders table (same initialization style as products-table.js)
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

function generateItems(seed) {
  const products = [
    "Duvet Cover",
    "Pillow Case",
    "Fitted Sheet",
    "Flat Sheet",
    "Throw Blanket",
    "Bath Towel",
    "Hand Towel",
    "Candle",
  ];
  const items = [];
  const count = (seed % 4) + 1;
  for (let i = 0; i < count; i++) {
    const name = products[(seed + i) % products.length];
    const quantity = ((seed + i) % 3) + 1;
    const price = 19 + ((seed * (i + 3)) % 60);
    const total = price * quantity;
    items.push({ name, quantity, price, total });
  }
  return items;
}

function computeTotals(items) {
  const subtotal = items.reduce((s, it) => s + it.total, 0);
  const shipping = subtotal > 120 ? 0 : 7.99;
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + tax + shipping;
  return { subtotal, tax, shipping, grandTotal };
}

function generateOrders(count) {
  const statuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];
  const firstNames = [
    "Liam",
    "Olivia",
    "Noah",
    "Emma",
    "Amelia",
    "Ava",
    "Mason",
    "Sophia",
    "Lucas",
    "Mia",
    "Ethan",
    "Isabella",
    "Aiden",
    "Charlotte",
    "James",
    "Harper",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Wilson",
    "Moore",
    "Taylor",
    "Anderson",
  ];

  const orders = [];
  for (let i = 1; i <= count; i++) {
    const status = statuses[i % statuses.length];
    const name = `${firstNames[i % firstNames.length]} ${
      lastNames[(i * 3) % lastNames.length]
    }`;
    const items = generateItems(i);
    const totals = computeTotals(items);
    orders.push({
      id: i,
      orderNumber: `#ORD${String(1000 + i)}`,
      customer: name,
      date: new Date(2025, i % 12, (i % 28) + 1).toISOString().slice(0, 10),
      total: totals.grandTotal.toFixed(2),
      status,
      items,
      totals,
    });
  }
  return orders;
}

// sample data (generated)
const data = generateOrders(50);

let mainOptions = {
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
      title: "Order #",
      field: "orderNumber",
      headerFilter: true,
      headerFilterPlaceholder: "Search",
      headerFilterParams: { clearable: true },
      headerFilterLiveFilter: true,
      formatter: (cell) => {
        const data = cell.getRow().getData();
        const href = `/src/pages/dashboard/orders/orderdetails.html?id=${data.id}`;
        const text = cell.getValue();
        return `<a href="${href}" class="text-secondary hover:underline">${text}</a>`;
      },
    },
    {
      title: "Customer",
      field: "customer",
      headerFilter: true,
      headerFilterPlaceholder: "Search",
      headerFilterParams: { clearable: true },
      headerFilterLiveFilter: true,
    },
    {
      title: "Date",
      field: "date",
      sorter: "date",
      headerFilter: true,
      headerFilterPlaceholder: "YYYY-MM-DD",
      headerFilterParams: { clearable: true },
      headerFilterLiveFilter: true,
    },
    {
      title: "Status",
      field: "status",
      headerFilter: "list",
      headerFilterParams: {
        values: {
          "": "All",
          Pending: "Pending",
          Processing: "Processing",
          Shipped: "Shipped",
          Delivered: "Delivered",
          Cancelled: "Cancelled",
        },
        clearable: true,
      },
      formatter: (cell) => {
        const text = cell.getValue();
        return `<span class="status-badge ${text === "Pending" ? "badge-Pending" : text === "Processing" ? "badge-Processing" : text === "Shipped" ? "badge-Shipped" : text === "Delivered" ? "badge-Delivered" : "badge-Cancelled"}">${text}</span>`;
      },
    },
    {
      title: "Total",
      field: "total",
      sorter: "number",
      formatter: (cell) => `$${Number(cell.getValue()).toFixed(2)}`,
      hozAlign: "right",
      headerFilter: true,
      headerFilterPlaceholder: "Search",
      headerFilterParams: { clearable: true },
      headerFilterLiveFilter: true,
    },
  ],
  initialSort: [
    { column: "date", dir: "desc" },
    { column: "orderNumber", dir: "desc" },
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("ordersTable");
  if (!container) return; // Only initialize on pages that have the table

  let table = new Tabulator(container, mainOptions);

  // Reinitialize table on resize similar to products implementation
  function reintializeTable() {
    if (!table) return;
    mainOptions.layout = window.innerWidth >= 768 ? "fitColumns" : "fitDataFill";
    table.destroy();
    table = new Tabulator(container, mainOptions);
  }

  window.addEventListener("resize", reintializeTable, { passive: true });
});


