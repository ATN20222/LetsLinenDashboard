// Products page: table init and filters
document.addEventListener('DOMContentLoaded', function () {
  var app = document.querySelector('.ds-app');
  var toggle = document.getElementById('sidebarToggle');
  if (toggle && app) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      app.classList.toggle('sidebar-open');
      toggle.setAttribute('aria-expanded', app.classList.contains('sidebar-open') ? 'true' : 'false');
    });
  }

  var table = null;
  var tableEl = document.getElementById('productsTable');
  var categoryFilter = document.getElementById('categoryFilter');
  var searchInput = document.getElementById('searchInput');

  function ensureTabulatorLoaded(cb) {
    if (window.Tabulator) return cb();
    var urls = [
      'https://cdn.jsdelivr.net/npm/tabulator-tables@5.6.2/dist/js/tabulator.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/tabulator/5.6.2/js/tabulator.min.js',
      'https://unpkg.com/tabulator-tables@5.6.2/dist/js/tabulator.min.js'
    ];
    (function loadSequential() {
      if (!urls.length) return cb();
      var s = document.createElement('script');
      s.src = urls.shift();
      s.onload = function () { cb(); };
      s.onerror = function () { loadSequential(); };
      document.head.appendChild(s);
    })();
  }

  function editFormatter(cell) {
    var id = cell.getRow().getData().id;
    return '<a class="order-link" href="./product-edit.html?id=' + id + '">Edit</a>';
  }

  function actionsFormatter(cell) {
    var id = cell.getRow().getData().id;
    return '<button class="btn danger" data-delete-id="' + id + '">Delete</button>';
  }

  function createProductsTable() {
    var data = ProductsStore.list();
    table = TableComponent.createTable(tableEl, {
      data: data,
      columns: [
        { title: 'SKU', field: 'sku', sorter: 'string', responsive: 0 },
        { title: 'Name', field: 'name', sorter: 'string', responsive: 0 },
        { title: 'Category', field: 'category', sorter: 'string', responsive: 1 },
        { title: 'Price ($)', field: 'price', sorter: 'number', responsive: 2 },
        { title: 'Stock', field: 'stock', sorter: 'number', responsive: 2 },
        { title: 'Edit', field: 'edit', width: 100, formatter: editFormatter, headerSort: false, responsive: 0 },
        { title: 'Delete', field: 'delete', width: 110, formatter: actionsFormatter, headerSort: false, responsive: 0 }
      ]
    });

    setTimeout(function () {
      if (window.AOS && window.AOS.refresh) window.AOS.refresh();
    }, 50);
  }

  function applyFilters() {
    if (!table) return;
    var cat = categoryFilter.value;
    var q = (searchInput.value || '').toLowerCase();
    table.clearFilter(true);
    var filters = [];
    if (cat) filters.push({ field: 'category', type: '=', value: cat });
    if (q) filters.push([{ field: 'name', type: 'like', value: q }, { field: 'sku', type: 'like', value: q }]);
    if (filters.length) table.setFilter(filters);
  }

  categoryFilter.addEventListener('change', applyFilters);
  searchInput.addEventListener('input', applyFilters);

  // Delegate delete clicks (supports Tabulator and fallback)
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-delete-id]');
    if (!btn) return;
    var id = Number(btn.getAttribute('data-delete-id'));
    Modal.confirm({ title: 'Delete Product', message: 'This action cannot be undone.', confirmText: 'Delete', danger: true })
      .then(function (ok) {
        if (!ok) return;
        ProductsStore.remove(id);
        if (table && table.replaceData) {
          table.replaceData(ProductsStore.list());
        }
      });
  });

  ensureTabulatorLoaded(createProductsTable);
});


