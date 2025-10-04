// Specific script
import {
  Tabulator,
  FormatModule,
  ResponsiveLayoutModule,
  SortModule,
  FilterModule,
  EditModule,
  ValidateModule,
  PageModule,
} from "tabulator-tables";
Tabulator.registerModule(FormatModule);
// Tabulator.registerModule(ResponsiveLayoutModule);
Tabulator.registerModule(SortModule);
Tabulator.registerModule(FilterModule);
Tabulator.registerModule(EditModule);
Tabulator.registerModule(ValidateModule);
Tabulator.registerModule(PageModule);

// sample data
let data = [
  {
    sku: "PRD-1001",
    name: "Wireless Headphones",
    category: "Electronics",
    price: 89.99,
    stock: 120,
  },
];

let mainOptions = {
  height: "100%",
  data: data,

  layout: "fitColumns",

  headerSortElement: "<i class='ti ti-arrows-sort'></i>",
  placeholder: "No data found",

  pagination: true,
  paginationSize: 10,
  paginationCounter: "rows",

  columnDefaults: { minWidth: 120 },

  columns: [
    {
      title: "Category",
      field: "category",
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
      title: "Price",
      field: "price",
      headerFilter: true,
      headerFilterPlaceholder: "Search",
      headerFilterParams: { clearable: true },
      headerFilterLiveFilter: true,
    },
    {
      title: "Stock",
      field: "stock",
      headerFilter: true,
      headerFilterPlaceholder: "Search",
      headerFilterParams: { clearable: true },
      headerFilterLiveFilter: true,
    },
  ],
  initialSort: [{ column: "name", dir: "asc" }],
};

let table = new Tabulator("#my-table", mainOptions);

// Reintialize table if screen is resized
function reintializeTable() {
  mainOptions.layout = window.innerWidth >= 768 ? "fitColumns" : "fitDataFill";
  table.destroy();
  table = new Tabulator("#my-table", mainOptions);
}

window.addEventListener("resize", reintializeTable);
