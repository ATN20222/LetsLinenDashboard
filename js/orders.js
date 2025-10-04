// Orders page initialization
document.addEventListener('DOMContentLoaded', function () {
  // Sidebar toggle (share behavior with dashboard)
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
  var tableEl = document.getElementById('ordersTable');
  var statusFilter = document.getElementById('statusFilter');
  var searchInput = document.getElementById('searchInput');
  var loadDemoBtn = document.getElementById('loadDemo');

  function loadScriptSequential(urls, onDone) {
    if (!urls.length) return onDone(new Error('All CDNs failed'));
    var url = urls.shift();
    var s = document.createElement('script');
    s.src = url;
    s.onload = function () { onDone(null); };
    s.onerror = function () { loadScriptSequential(urls, onDone); };
    document.head.appendChild(s);
  }

  function ensureTabulatorLoaded(cb) {
    if (window.Tabulator) return cb();
    loadScriptSequential([
      'https://cdn.jsdelivr.net/npm/tabulator-tables@5.6.2/dist/js/tabulator.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/tabulator/5.6.2/js/tabulator.min.js',
      'https://unpkg.com/tabulator-tables@5.6.2/dist/js/tabulator.min.js'
    ], function () { cb(); });
  }

  function statusFormatter(cell) {
    var val = cell.getValue();
    return '<span class="status-badge status-' + val + '">' + val + '</span>';
  }

  function linkFormatter(cell) {
    var id = cell.getRow().getData().id;
    var text = cell.getValue();
    return '<a class="order-link" href="./order-details.html?id=' + id + '">' + text + '</a>';
  }

  function createOrdersTable() {
    var data = OrdersStore.list();
    table = TableComponent.createTable(tableEl, {
      data: data,
      columns: [
        { title: 'Order #', field: 'orderNumber', sorter: 'string', headerFilter: false, formatter: linkFormatter, responsive: 0 },
        { title: 'Customer', field: 'customer', sorter: 'string', responsive: 1 },
        { title: 'Date', field: 'date', sorter: 'date', hozAlign: 'left', responsive: 2 },
        { title: 'Total ($)', field: 'total', sorter: 'number', responsive: 2 },
        { title: 'Status', field: 'status', sorter: 'string', formatter: statusFormatter, responsive: 0 }
      ]
    });

    // Trigger AOS after table render (Tabulator or fallback)
    setTimeout(function () {
      if (window.AOS && typeof window.AOS.refreshHard === 'function') {
        window.AOS.refreshHard();
      } else if (window.AOS && typeof window.AOS.refresh === 'function') {
        window.AOS.refresh();
      }
    }, 50);
  }

  function applyFilters() {
    if (!table) return;
    var statusVal = statusFilter.value;
    var q = (searchInput.value || '').toLowerCase();
    table.clearFilter(true);
    var filters = [];
    if (statusVal) {
      filters.push({ field: 'status', type: '=', value: statusVal });
    }
    if (q) {
      filters.push([
        { field: 'orderNumber', type: 'like', value: q },
        { field: 'customer', type: 'like', value: q }
      ]);
    }
    if (filters.length) table.setFilter(filters);
  }

  statusFilter.addEventListener('change', applyFilters);
  searchInput.addEventListener('input', applyFilters);

  if (loadDemoBtn) {
    loadDemoBtn.addEventListener('click', function () {
      var seeded = OrdersStore.resetDemo(200);
      if (table && table.replaceData) {
        table.replaceData(seeded);
        statusFilter.value = '';
        searchInput.value = '';
        table.clearFilter(true);
        setTimeout(function () {
          if (window.AOS && typeof window.AOS.refreshHard === 'function') {
            window.AOS.refreshHard();
          } else if (window.AOS && typeof window.AOS.refresh === 'function') {
            window.AOS.refresh();
          }
        }, 50);
      } else {
        ensureTabulatorLoaded(function () {
          if (!table) createOrdersTable();
          if (table && table.replaceData) {
            table.replaceData(seeded);
          }
        });
      }
    });
  }

  ensureTabulatorLoaded(function () {
    createOrdersTable();
  });
});


